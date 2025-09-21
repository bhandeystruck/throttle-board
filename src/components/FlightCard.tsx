import { Database } from '@/integrations/supabase/types';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];
import { StatusBadge } from './StatusBadge';
import { FlightUpdateForm } from './FlightUpdateForm';
import { FlightDeleteDialog } from './FlightDeleteDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';

interface FlightCardProps {
  flight: FlightRequest;
  onUpdate?: () => void;
}

export function FlightCard({ flight, onUpdate }: FlightCardProps) {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="flight-card group">
      <div className="flex items-start justify-between mb-3">
        <StatusBadge status={flight.status} />
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(flight.submitted_at)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="font-mono text-sm font-semibold">{flight.origin_icao.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">{flight.origin_city}</div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="h-px bg-border flex-1"></div>
            <Plane className="w-4 h-4 mx-2 text-primary" />
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="text-center">
            <div className="font-mono text-sm font-semibold">{flight.destination_icao.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">{flight.destination_city}</div>
          </div>
        </div>

        {/* Aircraft & Airline */}
        {(flight.aircraft || flight.airline) && (
          <div className="text-sm text-muted-foreground">
            {flight.airline && <span className="font-medium">{flight.airline}</span>}
            {flight.airline && flight.aircraft && <span className="mx-1">•</span>}
            {flight.aircraft}
          </div>
        )}

        {/* Requester */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-primary font-medium">{flight.requester_handle}</span>
            {flight.platform && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">
                {flight.platform}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {isAdmin && onUpdate && (
              <FlightUpdateForm flight={flight} onUpdate={onUpdate} />
            )}
            {isAdmin && onUpdate && (
              <FlightDeleteDialog flight={flight} onDelete={onUpdate} />
            )}
            <Button asChild variant="outline" size="sm" className="flex-1 min-w-0">
              <Link to={`/request/${flight.id}`}>
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Public Notes */}
        {flight.notes_public && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
            "{flight.notes_public}"
          </p>
        )}
      </div>
    </Card>
  );
}