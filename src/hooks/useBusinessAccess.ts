import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Business, BusinessSettingsFormValues, BusinessMember } from '../types/models';
import { useAuth } from './useAuth';

interface BusinessAccess {
  business: Business | null;
  member: BusinessMember | null;
}

export function useBusinessAccess() {
  const { user, loading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['business-access', user?.id],
    enabled: !!user && !authLoading,
    queryFn: async (): Promise<BusinessAccess> => {
      if (!user) return { business: null, member: null };

      const { data: member, error: memberError } = await supabase
        .from('business_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member) return { business: null, member: null };

      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', member.business_id)
        .single();

      if (businessError) throw businessError;
      return { business, member };
    },
  });

  return {
    ...query,
    business: query.data?.business ?? null,
    member: query.data?.member ?? null,
    businessId: query.data?.business?.id ?? null,
    hasAccess: Boolean(query.data?.business && query.data.member),
    isOwner: query.data?.member?.role === 'owner',
  };
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  const { businessId } = useBusinessAccess();

  return useMutation({
    mutationFn: async (values: BusinessSettingsFormValues) => {
      if (!businessId) throw new Error('Business belum tersedia.');
      const { data, error } = await supabase
        .from('businesses')
        .update({
          name: values.name,
          owner_name: values.owner_name || null,
          phone: values.phone || null,
          address: values.address || null,
        })
        .eq('id', businessId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['business-access'] });
    },
  });
}
