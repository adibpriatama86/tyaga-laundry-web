import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { DurationType, Service, ServiceFormValues, ServicePrice, ServiceWithPrices } from '../types/models';

const durations: DurationType[] = ['one_day', 'two_days', 'three_days', 'regular'];

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
          .sort((a, b) => durations.indexOf(a.duration_type) - durations.indexOf(b.duration_type)),
      }));
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

      const pricePayload = durations.map((duration) => ({
        service_id: service.id,
        duration_type: duration,
        price: Number(values.prices[duration] ?? 0),
        is_active: true,
      })) satisfies Array<Pick<ServicePrice, 'service_id' | 'duration_type' | 'price' | 'is_active'>>;

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
