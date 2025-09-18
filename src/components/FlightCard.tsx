import { FlightRequest } from '@/types/flight';
import { StatusBadge } from './StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlightCardProps {
  flight: FlightRequest;
}

export function FlightCard({ flight }: FlightCardProps) {
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
          {formatDate(flight.submittedAt)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="font-mono text-sm font-semibold">{flight.originIcao}</div>
            <div className="text-xs text-muted-foreground">{flight.originCity}</div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="h-px bg-border flex-1"></div>
            <Plane className="w-4 h-4 mx-2 text-primary" />
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="text-center">
            <div className="font-mono text-sm font-semibold">{flight.destinationIcao}</div>
            <div className="text-xs text-muted-foreground">{flight.destinationCity}</div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-primary font-medium">{flight.requesterHandle}</span>
            {flight.platform && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">
                {flight.platform}
              </span>
            )}
          </div>

          <Button asChild variant="outline" size="sm">
            <Link to={`/request/${flight.id}`}>
              View Details
            </Link>
          </Button>
        </div>

        {/* Public Notes */}
        {flight.notesPublic && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
            "{flight.notesPublic}"
          </p>
        )}
      </div>
    </Card>
  );
}