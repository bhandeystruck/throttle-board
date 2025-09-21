import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDeleteFlightRequest } from '@/hooks/useFlights';
import { Database } from '@/integrations/supabase/types';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];

interface FlightDeleteDialogProps {
  flight: FlightRequest;
  onDelete: () => void;
}

export function FlightDeleteDialog({ flight, onDelete }: FlightDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteFlightMutation = useDeleteFlightRequest();

  const handleDelete = async () => {
    try {
      await deleteFlightMutation.mutateAsync(flight.id);
      toast({
        title: "Flight Deleted",
        description: `Flight request ${flight.origin_icao.toUpperCase()} → ${flight.destination_icao.toUpperCase()} has been permanently deleted.`,
      });
      setIsOpen(false);
      onDelete();
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the flight request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Flight Request
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete this flight request? This action cannot be undone.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium text-sm">
                {flight.origin_icao.toUpperCase()} → {flight.destination_icao.toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Requester: {flight.requester_handle}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {flight.status}
              </p>
            </div>
            <p className="text-sm text-destructive font-medium">
              This will permanently delete:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
              <li>The flight request</li>
              <li>All status events</li>
              <li>All media links</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteFlightMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteFlightMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteFlightMutation.isPending ? 'Deleting...' : 'Delete Flight'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
