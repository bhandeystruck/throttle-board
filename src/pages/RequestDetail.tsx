import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, User, Plane, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { mockFlights, mockStatusEvents, mockMediaLinks } from '@/data/mockData';

export default function RequestDetail() {
  const { id } = useParams();
  
  // In real app, this would fetch from Supabase
  const flight = mockFlights.find(f => f.id === id);
  const statusEvents = mockStatusEvents.filter(e => e.flightRequestId === id);
  const mediaLinks = mockMediaLinks.filter(l => l.flightRequestId === id);

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Flight Request Not Found</h1>
          <Button asChild>
            <Link to="/">← Back to Feed</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Flight Request #{flight.id}
            </h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {flight.requesterHandle}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDateTime(flight.submittedAt)}
              </span>
            </div>
          </div>
          <StatusBadge status={flight.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Route
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center flex-1">
                  <div className="text-2xl font-mono font-bold">{flight.originIcao}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {flight.originCity}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-px bg-border flex-1"></div>
                  <Plane className="w-6 h-6 mx-3 text-primary" />
                  <div className="h-px bg-border flex-1"></div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-2xl font-mono font-bold">{flight.destinationIcao}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {flight.destinationCity}
                  </div>
                </div>
              </div>

              {(flight.airline || flight.aircraft || flight.sim) && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  {flight.airline && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Airline:</span>
                      <span className="font-medium">{flight.airline}</span>
                    </div>
                  )}
                  {flight.aircraft && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aircraft:</span>
                      <span className="font-medium">{flight.aircraft}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Simulator:</span>
                    <span className="font-medium">{flight.sim}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {flight.notesPublic && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Requester Notes</h2>
              <p className="text-muted-foreground leading-relaxed">
                "{flight.notesPublic}"
              </p>
            </Card>
          )}

          {/* Media Links */}
          {mediaLinks.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Watch the Flight</h2>
              <div className="space-y-3">
                {mediaLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{link.title || `${link.platform} Video`}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {link.platform} • Published {formatDateTime(link.publishedAt)}
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Watch
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status Timeline</h3>
            <div className="space-y-4">
              {statusEvents
                .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
                .map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`} />
                    {index < statusEvents.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium capitalize">
                      {event.toStatus.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(event.changedAt)}
                    </div>
                    {event.comment && (
                      <div className="text-sm mt-1">{event.comment}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Request Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Request Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{formatDateTime(flight.submittedAt)}</span>
              </div>
              
              {flight.platform && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <Badge variant="outline" className="capitalize">
                    {flight.platform}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span>{flight.priority}/5</span>
              </div>
              
              {flight.eta && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA:</span>
                  <span>{formatDateTime(flight.eta)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link to="/submit">Request Similar Flight</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}