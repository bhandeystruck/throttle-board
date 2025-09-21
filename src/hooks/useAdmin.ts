import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: async () => {
      if (!user) return false;

      try {
        // Use a secure RPC function instead of direct table access
        const { data, error } = await supabase.rpc('check_admin_status', {
          user_uuid: user.id
        } as any);

        if (error) {
          // Log error securely without exposing details
          if (process.env.NODE_ENV === 'development') {
            console.warn('Admin check failed:', error.message);
          }
          return false;
        }

        return Boolean(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Admin check error:', error);
        }
        return false;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on failure to prevent brute force
  });
}

export function useIsAdmin() {
  const { data: isAdmin, isLoading, error } = useAdmin();
  
  // Always return false on error to prevent privilege escalation
  return { 
    isAdmin: (isAdmin && !error) || false, 
    isLoading 
  };
}
