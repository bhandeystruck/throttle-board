import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateFlightRequest } from '@/hooks/useFlights';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type FlightRequestInsert = Database['public']['Tables']['flight_requests']['Insert'];

interface SubmitFormData {
  requesterHandle: string;
  platform?: string;
  originIcao: string;
  originCity: string;
  destinationIcao: string;
  destinationCity: string;
  airline?: string;
  aircraft?: string;
  notesPublic?: string;
}

export default function SubmitRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createFlightMutation = useCreateFlightRequest();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubmitFormData>();

  const onSubmit = async (data: SubmitFormData) => {
    try {
      // Transform form data to database format
      const flightData: FlightRequestInsert = {
        requester_handle: data.requesterHandle,
        platform: data.platform as any || null,
        origin_icao: data.originIcao.toUpperCase(),
        origin_city: data.originCity,
        destination_icao: data.destinationIcao.toUpperCase(),
        destination_city: data.destinationCity,
        airline: data.airline || null,
        aircraft: data.aircraft || null,
        sim: 'MSFS 2024', // Default simulator
        notes_public: data.notesPublic || null,
        priority: 1, // Default priority
        visibility: 'public', // Default visibility
        status: 'requested', // Initial status
        user_id: user?.id || null, // Include user_id if authenticated
      };

      // Submit to database
      const newFlight = await createFlightMutation.mutateAsync(flightData);
      
      toast({
        title: "Flight Request Submitted!",
        description: `Your request #${newFlight.id.slice(0, 8)} has been added to the queue. You'll be notified when it's ready!`,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting flight request:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your flight request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
        </Button>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Request a Flight</h1>
          <p className="text-muted-foreground">
            Submit your flight request and watch it come to life on @ThrottleAndFlaps!
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Requester Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requesterHandle">Your Handle/Username *</Label>
                <Input
                  id="requesterHandle"
                  placeholder="@your_handle"
                  {...register('requesterHandle', { 
                    required: 'Handle is required',
                    pattern: {
                      value: /^@[a-zA-Z0-9_]+$/,
                      message: 'Handle must start with @ and contain only letters, numbers, and underscores'
                    }
                  })}
                />
                {errors.requesterHandle && (
                  <p className="text-sm text-destructive">{errors.requesterHandle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform (Optional)</Label>
                <Select onValueChange={(value) => setValue('platform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where you follow me" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Flight Route</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">Departure</h3>
                <div className="space-y-2">
                  <Label htmlFor="originIcao">Airport Code *</Label>
                  <Input
                    id="originIcao"
                    placeholder="KJFK"
                    className="font-mono"
                    {...register('originIcao', { 
                      required: 'Origin airport is required',
                      pattern: {
                        value: /^[A-Z]{3,4}$/,
                        message: 'Enter a valid ICAO code (3-4 letters)'
                      }
                    })}
                  />
                  {errors.originIcao && (
                    <p className="text-sm text-destructive">{errors.originIcao.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originCity">City *</Label>
                  <Input
                    id="originCity"
                    placeholder="New York"
                    {...register('originCity', { required: 'Origin city is required' })}
                  />
                  {errors.originCity && (
                    <p className="text-sm text-destructive">{errors.originCity.message}</p>
                  )}
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">Arrival</h3>
                <div className="space-y-2">
                  <Label htmlFor="destinationIcao">Airport Code *</Label>
                  <Input
                    id="destinationIcao"
                    placeholder="EGLL"
                    className="font-mono"
                    {...register('destinationIcao', { 
                      required: 'Destination airport is required',
                      pattern: {
                        value: /^[A-Z]{3,4}$/,
                        message: 'Enter a valid ICAO code (3-4 letters)'
                      }
                    })}
                  />
                  {errors.destinationIcao && (
                    <p className="text-sm text-destructive">{errors.destinationIcao.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationCity">City *</Label>
                  <Input
                    id="destinationCity"
                    placeholder="London"
                    {...register('destinationCity', { required: 'Destination city is required' })}
                  />
                  {errors.destinationCity && (
                    <p className="text-sm text-destructive">{errors.destinationCity.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Aircraft Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Aircraft Preferences (Optional)</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airline">Preferred Airline</Label>
                <Input
                  id="airline"
                  placeholder="e.g., United Airlines"
                  {...register('airline')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aircraft">Preferred Aircraft</Label>
                <Input
                  id="aircraft"
                  placeholder="e.g., Boeing 787-9"
                  {...register('aircraft')}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notesPublic">Special Requests or Notes</Label>
            <Textarea
              id="notesPublic"
              placeholder="Any special requests? Preferred approach? Scenery you'd like to see? Time of day preferences?"
              className="min-h-[100px]"
              {...register('notesPublic')}
            />
            <p className="text-xs text-muted-foreground">
              These notes will be visible publicly with your request.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={createFlightMutation.isPending}
            >
              {createFlightMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Flight Request
                </>
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By submitting this request, you agree that your flight details and handle may be featured 
            in @ThrottleAndFlaps content across social media platforms.
          </p>
        </form>
      </Card>
    </div>
  );
}