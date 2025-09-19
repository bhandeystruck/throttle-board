import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlightService } from '@/services/flightService';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];
type FlightRequestInsert = Database['public']['Tables']['flight_requests']['Insert'];

// Get all public flights
export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: () => FlightService.getPublicFlights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all flights for admin (including private/unlisted)
export function useAllFlightsForAdmin() {
  return useQuery({
    queryKey: ['flights', 'admin'],
    queryFn: () => FlightService.getAllFlightsForAdmin(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get flights by status
export function useFlightsByStatus(status: string) {
  return useQuery({
    queryKey: ['flights', 'status', status],
    queryFn: () => FlightService.getFlightsByStatus(status),
    staleTime: 5 * 60 * 1000,
  });
}

// Get single flight
export function useFlight(id: string) {
  return useQuery({
    queryKey: ['flight', id],
    queryFn: () => FlightService.getFlightById(id),
    enabled: !!id,
  });
}

// Get user's flights
export function useUserFlights() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['flights', 'user', user?.id],
    queryFn: () => FlightService.getUserFlights(user!.id),
    enabled: !!user?.id,
  });
}

// Get media links for a flight
export function useMediaLinks(flightId: string) {
  return useQuery({
    queryKey: ['media-links', flightId],
    queryFn: () => FlightService.getMediaLinks(flightId),
    enabled: !!flightId,
  });
}

// Get status events for a flight
export function useStatusEvents(flightId: string) {
  return useQuery({
    queryKey: ['status-events', flightId],
    queryFn: () => FlightService.getStatusEvents(flightId),
    enabled: !!flightId,
  });
}

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => FlightService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Search flights
export function useSearchFlights(query: string) {
  return useQuery({
    queryKey: ['flights', 'search', query],
    queryFn: () => FlightService.searchFlights(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

// Create flight request mutation
export function useCreateFlightRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (flightData: FlightRequestInsert) => {
      return FlightService.createFlightRequest(flightData);
    },
    onSuccess: () => {
      // Invalidate and refetch flights
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// Update flight status mutation
export function useUpdateFlightStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: string; comment?: string }) => {
      return FlightService.updateFlightStatus(id, status, comment);
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['flight', data.id] });
      queryClient.invalidateQueries({ queryKey: ['status-events', data.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// Update flight request mutation
export function useUpdateFlightRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: Database['public']['Tables']['flight_requests']['Update'] }) => {
      return FlightService.updateFlightRequest(id, updateData);
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['flight', data.id] });
      queryClient.invalidateQueries({ queryKey: ['status-events', data.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// Add media link mutation
export function useAddMediaLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaData: {
      flight_request_id: string;
      platform: string;
      url: string;
      title?: string;
      thumbnail_url?: string;
    }) => {
      return FlightService.addMediaLink(mediaData);
    },
    onSuccess: (data) => {
      // Invalidate media links for this flight
      queryClient.invalidateQueries({ 
        queryKey: ['media-links', data.flight_request_id] 
      });
    },
  });
}

// Delete flight request mutation
export function useDeleteFlightRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return FlightService.deleteFlightRequest(id);
    },
    onSuccess: () => {
      // Invalidate all flight-related queries
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
