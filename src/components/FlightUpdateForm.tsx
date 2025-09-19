import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUpdateFlightRequest } from '@/hooks/useFlights';
import { Database } from '@/integrations/supabase/types';

type FlightStatus = Database['public']['Tables']['flight_requests']['Row']['status'];
import { Edit, Save, X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];
type FlightRequestUpdate = Database['public']['Tables']['flight_requests']['Update'];

interface FlightUpdateFormProps {
  flight: FlightRequest;
  onUpdate: () => void;
}

export function FlightUpdateForm({ flight, onUpdate }: FlightUpdateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FlightRequestUpdate>({
    requester_handle: flight.requester_handle,
    platform: flight.platform,
    origin_icao: flight.origin_icao,
    origin_city: flight.origin_city,
    destination_icao: flight.destination_icao,
    destination_city: flight.destination_city,
    airline: flight.airline,
    aircraft: flight.aircraft,
    sim: flight.sim,
    notes_public: flight.notes_public,
    notes_private: flight.notes_private,
    eta: flight.eta,
    priority: flight.priority,
    visibility: flight.visibility,
    status: flight.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateFlightMutation = useUpdateFlightRequest();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.requester_handle?.trim()) {
      newErrors.requester_handle = 'Requester handle is required';
    }
    if (!formData.origin_icao?.trim()) {
      newErrors.origin_icao = 'Origin ICAO is required';
    }
    if (!formData.origin_city?.trim()) {
      newErrors.origin_city = 'Origin city is required';
    }
    if (!formData.destination_icao?.trim()) {
      newErrors.destination_icao = 'Destination ICAO is required';
    }
    if (!formData.destination_city?.trim()) {
      newErrors.destination_city = 'Destination city is required';
    }
    if (!formData.sim?.trim()) {
      newErrors.sim = 'Simulator is required';
    }
    if (formData.priority !== undefined && (formData.priority < 1 || formData.priority > 10)) {
      newErrors.priority = 'Priority must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateFlightMutation.mutateAsync({ id: flight.id, updateData: formData });
      toast({
        title: "Success",
        description: "Flight details updated successfully.",
      });
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating flight:', error);
      toast({
        title: "Error",
        description: "Failed to update flight details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof FlightRequestUpdate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      requester_handle: flight.requester_handle,
      platform: flight.platform,
      origin_icao: flight.origin_icao,
      origin_city: flight.origin_city,
      destination_icao: flight.destination_icao,
      destination_city: flight.destination_city,
      airline: flight.airline,
      aircraft: flight.aircraft,
      sim: flight.sim,
      notes_public: flight.notes_public,
      notes_private: flight.notes_private,
      eta: flight.eta,
      priority: flight.priority,
      visibility: flight.visibility,
      status: flight.status,
    });
    setErrors({});
  };

  const statusOptions: { value: FlightStatus; label: string }[] = [
    { value: 'requested', label: 'Requested' },
    { value: 'queued', label: 'Queued' },
    { value: 'planning', label: 'Planning' },
    { value: 'underway', label: 'Underway' },
    { value: 'edited', label: 'Edited' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
    { value: 'declined', label: 'Declined' },
  ];

  const platformOptions = [
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Other' },
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'private', label: 'Private' },
  ];

  const simOptions = [
    { value: 'msfs', label: 'Microsoft Flight Simulator' },
    { value: 'xplane', label: 'X-Plane' },
    { value: 'prepar3d', label: 'Prepar3D' },
    { value: 'fsx', label: 'Flight Simulator X' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-shrink-0">
          <Edit className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Edit Flight</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Flight Details
            <Badge variant="outline" className="ml-2">
              {flight.id.slice(0, 8)}...
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requester_handle">Requester Handle *</Label>
                <Input
                  id="requester_handle"
                  value={formData.requester_handle || ''}
                  onChange={(e) => handleInputChange('requester_handle', e.target.value)}
                  className={errors.requester_handle ? 'border-red-500' : ''}
                />
                {errors.requester_handle && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.requester_handle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform || ''}
                  onValueChange={(value) => handleInputChange('platform', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim">Simulator *</Label>
                <Select
                  value={formData.sim || ''}
                  onValueChange={(value) => handleInputChange('sim', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select simulator" />
                  </SelectTrigger>
                  <SelectContent>
                    {simOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sim && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.sim}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority || ''}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                  className={errors.priority ? 'border-red-500' : ''}
                />
                {errors.priority && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.priority}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Route Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin_icao">Origin ICAO *</Label>
                <Input
                  id="origin_icao"
                  value={formData.origin_icao || ''}
                  onChange={(e) => handleInputChange('origin_icao', e.target.value.toUpperCase())}
                  className={errors.origin_icao ? 'border-red-500' : ''}
                  placeholder="e.g., KJFK"
                />
                {errors.origin_icao && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.origin_icao}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin_city">Origin City *</Label>
                <Input
                  id="origin_city"
                  value={formData.origin_city || ''}
                  onChange={(e) => handleInputChange('origin_city', e.target.value)}
                  className={errors.origin_city ? 'border-red-500' : ''}
                  placeholder="e.g., New York"
                />
                {errors.origin_city && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.origin_city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination_icao">Destination ICAO *</Label>
                <Input
                  id="destination_icao"
                  value={formData.destination_icao || ''}
                  onChange={(e) => handleInputChange('destination_icao', e.target.value.toUpperCase())}
                  className={errors.destination_icao ? 'border-red-500' : ''}
                  placeholder="e.g., EGLL"
                />
                {errors.destination_icao && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.destination_icao}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination_city">Destination City *</Label>
                <Input
                  id="destination_city"
                  value={formData.destination_city || ''}
                  onChange={(e) => handleInputChange('destination_city', e.target.value)}
                  className={errors.destination_city ? 'border-red-500' : ''}
                  placeholder="e.g., London"
                />
                {errors.destination_city && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.destination_city}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Aircraft Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Aircraft Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={formData.airline || ''}
                  onChange={(e) => handleInputChange('airline', e.target.value || null)}
                  placeholder="e.g., American Airlines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aircraft">Aircraft</Label>
                <Input
                  id="aircraft"
                  value={formData.aircraft || ''}
                  onChange={(e) => handleInputChange('aircraft', e.target.value || null)}
                  placeholder="e.g., Boeing 737-800"
                />
              </div>
            </div>
          </Card>

          {/* Status and Visibility */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Status & Visibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => handleInputChange('status', value as FlightStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility || ''}
                  onValueChange={(value) => handleInputChange('visibility', value as 'public' | 'unlisted' | 'private')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eta">ETA</Label>
                <Input
                  id="eta"
                  type="datetime-local"
                  value={formData.eta ? new Date(formData.eta).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('eta', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes_public">Public Notes</Label>
                <Textarea
                  id="notes_public"
                  value={formData.notes_public || ''}
                  onChange={(e) => handleInputChange('notes_public', e.target.value || null)}
                  placeholder="Notes visible to the public..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes_private">Private Notes</Label>
                <Textarea
                  id="notes_private"
                  value={formData.notes_private || ''}
                  onChange={(e) => handleInputChange('notes_private', e.target.value || null)}
                  placeholder="Internal notes (not visible to public)..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={updateFlightMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateFlightMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
