import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];
type FlightRequestInsert = Database['public']['Tables']['flight_requests']['Insert'];
type FlightRequestUpdate = Database['public']['Tables']['flight_requests']['Update'];
type MediaLink = Database['public']['Tables']['media_links']['Row'];
type StatusEvent = Database['public']['Tables']['status_events']['Row'];

export class FlightService {
  // Get all public flight requests
  static async getPublicFlights() {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('visibility', 'public')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get flight requests by status
  static async getFlightsByStatus(status: string) {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('status', status)
      .eq('visibility', 'public')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get a single flight request by ID
  static async getFlightById(id: string) {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create a new flight request using secure RPC function
  static async createFlightRequest(flightData: FlightRequestInsert) {
    if (process.env.NODE_ENV === 'development') {
      console.log('createFlightRequest called with data:', flightData);
    }

    const { data: flightId, error } = await (supabase as any).rpc('create_flight_request_safe', {
      p_requester_handle: flightData.requester_handle,
      p_origin_icao: flightData.origin_icao,
      p_origin_city: flightData.origin_city,
      p_destination_icao: flightData.destination_icao,
      p_destination_city: flightData.destination_city,
      p_platform: flightData.platform,
      p_airline: flightData.airline,
      p_aircraft: flightData.aircraft,
      p_notes_public: flightData.notes_public
    });

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('createFlightRequest error:', error);
      }
      throw error;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('createFlightRequest result - flightId:', flightId);
    }

    // Fetch the complete flight object
    const { data: flight, error: fetchError } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('id', flightId)
      .single();

    if (fetchError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching created flight:', fetchError);
      }
      throw fetchError;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Created flight object:', flight);
    }

    return flight;
  }

  // Update flight request status
  static async updateFlightStatus(id: string, status: string, comment?: string) {
    // Get current flight to track status change
    const { data: currentFlight } = await supabase
      .from('flight_requests')
      .select('status')
      .eq('id', id)
      .single() as { data: any };

    // Update the flight status
    const { data, error } = await (supabase as any)
      .from('flight_requests')
      .update({ 
        status: status as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create status event
    if (currentFlight) {
      await supabase
        .from('status_events')
        .insert({
          flight_request_id: id,
          from_status: currentFlight.status as any,
          to_status: status as any,
          comment: comment || `Status changed to ${status}`,
          changed_by: null // This should be set to the actual admin user ID
        } as any);
    }

    return data;
  }

  // Get media links for a flight
  static async getMediaLinks(flightId: string) {
    const { data, error } = await supabase
      .from('media_links')
      .select('*')
      .eq('flight_request_id', flightId)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Add media link to a flight
  static async addMediaLink(mediaData: {
    flight_request_id: string;
    platform: string;
    url: string;
    title?: string;
    thumbnail_url?: string;
  }) {
    const { data, error } = await supabase
      .from('media_links')
      .insert(mediaData as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get status events for a flight
  static async getStatusEvents(flightId: string) {
    const { data, error } = await supabase
      .from('status_events')
      .select('*')
      .eq('flight_request_id', flightId)
      .order('changed_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Search flights
  static async searchFlights(query: string) {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('visibility', 'public')
      .or(`origin_icao.ilike.%${query}%,origin_city.ilike.%${query}%,destination_icao.ilike.%${query}%,destination_city.ilike.%${query}%,airline.ilike.%${query}%,aircraft.ilike.%${query}%,requester_handle.ilike.%${query}%`)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get user's flight requests
  static async getUserFlights(userId: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log('getUserFlights called with userId:', userId);
    }

    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('getUserFlights error:', error);
      }
      throw error;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('getUserFlights result:', { data, count: data?.length });
    }

    return data;
  }

  // Update flight request details
  static async updateFlightRequest(id: string, updateData: FlightRequestUpdate) {
    // Get current flight to track changes
    const { data: currentFlight } = await supabase
      .from('flight_requests')
      .select('*')
      .eq('id', id)
      .single() as { data: any };

    // Update the flight request
    const { data, error } = await (supabase as any)
      .from('flight_requests')
      .update({ 
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create status event if status changed
    if (updateData.status && currentFlight && currentFlight.status !== updateData.status) {
      await supabase
        .from('status_events')
        .insert({
          flight_request_id: id,
          from_status: currentFlight.status as any,
          to_status: updateData.status as any,
          comment: `Flight details updated and status changed to ${updateData.status}`,
          changed_by: null // This should be set to the actual admin user ID
        } as any);
    }

    return data;
  }

  // Get all flights for admin (including private/unlisted)
  static async getAllFlightsForAdmin() {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Delete flight request (admin only)
  static async deleteFlightRequest(id: string) {
    // First, delete related records (status_events and media_links)
    await supabase
      .from('status_events')
      .delete()
      .eq('flight_request_id', id);

    await supabase
      .from('media_links')
      .delete()
      .eq('flight_request_id', id);

    // Then delete the flight request
    const { data, error } = await supabase
      .from('flight_requests')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    const { data, error } = await supabase
      .from('flight_requests')
      .select('status');

    if (error) throw error;

    const stats = data.reduce((acc, flight: any) => {
      acc[flight.status] = (acc[flight.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.length,
      requested: stats.requested || 0,
      queued: stats.queued || 0,
      planning: stats.planning || 0,
      underway: stats.underway || 0,
      edited: stats.edited || 0,
      published: stats.published || 0,
      archived: stats.archived || 0,
      declined: stats.declined || 0,
    };
  }
}
