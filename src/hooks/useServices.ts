import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { DurationType, Service, ServiceFormValues, ServicePrice, ServiceWithPrices } from '../types/models';

const durations: DurationType[] = ['one_day', 'two_days', 'three_days', 'four_days', 'five_days'];

function buildPricePayload(serviceId: string, values: ServiceFormValues) {
  return durations.map((duration) => ({
    service_id: serviceId,
    duration_type: duration,
    price: Number(values.prices[duration] ?? 0),
    is_active: true,
  })) satisfies Array<Pick<ServicePrice, 'service_id' | 'duration_type' | 'price' | 'is_active'>>;
}

export function useServices(businessId: string | null) {
  return useQuery({
    queryKey: ['services', businessId],
    enabled: !!businessId,
    queryFn: async (): Promise<ServiceWithPrices[]> => {
      if (!businessId) return [];

      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (servicesError) throw servicesError;
      if (!services?.length) return [];

      const { data: prices, error: pricesError } = await supabase
        .from('service_prices')
        .select('*')
        .in(
          'service_id',
          services.map((service) => service.id),
        );

      if (pricesError) throw pricesError;
      const priceList = prices ?? [];

      return services.map((service) => ({
        ...service,
        service_prices: priceList
          .filter((price) => price.service_id === service.id)
          .filter((price) => durations.includes(price.duration_type))
          .sort((a, b) => durations.indexOf(a.duration_type) - durations.indexOf(b.duration_type)),
      }));
    },
  });
}

export function useCreateService(businessId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      if (!businessId) throw new Error('Business belum tersedia.');

      const code = values.code.trim().toUpperCase();
      const name = values.name.trim();

      const { data: existingService, error: duplicateError } = await supabase
        .from('services')
        .select('id')
        .eq('business_id', businessId)
        .eq('code', code)
        .maybeSingle();

      if (duplicateError) throw duplicateError;
      if (existingService) throw new Error('Kode layanan sudah digunakan.');

      const { data: lastService, error: orderError } = await supabase
        .from('services')
        .select('display_order')
        .eq('business_id', businessId)
        .order('display_order', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

      if (orderError) throw orderError;

      const { data: createdService, error: serviceError } = await supabase
        .from('services')
        .insert({
          business_id: businessId,
          code,
          name,
          unit_type: values.unit_type,
          is_active: true,
          display_order: Number(lastService?.display_order ?? 0) + 1,
        } satisfies Omit<Service, 'id' | 'created_at' | 'updated_at'>)
        .select()
        .single();

      if (serviceError) throw serviceError;

      const { error: priceError } = await supabase.from('service_prices').insert(buildPricePayload(createdService.id, values));

      if (priceError) {
        await supabase.from('services').delete().eq('id', createdService.id).eq('business_id', businessId);
        throw priceError;
      }

      return createdService;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats', businessId] });
      await queryClient.invalidateQueries({ queryKey: ['monthly-report', businessId] });
    },
  });
}

export function useUpdateService(businessId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ service, values }: { service: ServiceWithPrices; values: ServiceFormValues }) => {
      if (!businessId) throw new Error('Business belum tersedia.');

      const { data: updatedService, error: serviceError } = await supabase
        .from('services')
        .update({
          code: values.code.trim(),
          name: values.name.trim(),
          unit_type: values.unit_type,
          is_active: values.is_active,
        } satisfies Partial<Service>)
        .eq('id', service.id)
        .eq('business_id', businessId)
        .select()
        .single();

      if (serviceError) throw serviceError;

      const pricePayload = buildPricePayload(service.id, values);

      const { error: priceError } = await supabase
        .from('service_prices')
        .upsert(pricePayload, { onConflict: 'service_id,duration_type' });

      if (priceError) throw priceError;
      return updatedService;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats', businessId] });
      await queryClient.invalidateQueries({ queryKey: ['monthly-report', businessId] });
    },
  });
}
