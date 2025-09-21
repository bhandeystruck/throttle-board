import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, User, Plane, MapPin, Loader2 } from 'lucide-react';
import { TikTokIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { useFlight, useStatusEvents, useMediaLinks } from '@/hooks/useFlights';
import { Database } from '@/integrations/supabase/types';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];
type MediaLink = Database['public']['Tables']['media_links']['Row'];
type StatusEvent = Database['public']['Tables']['status_events']['Row'];

export default function RequestDetail() {
  const { id } = useParams();
  
  // Fetch flight data from database
  const { data: flight, isLoading: flightLoading, error: flightError } = useFlight(id!);
  const { data: statusEvents = [] } = useStatusEvents(id!);
  const { data: mediaLinks = [] } = useMediaLinks(id!);

  // Loading state
  if (flightLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading flight details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (flightError || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Flight Request Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The flight request you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">← Back to Feed</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Type assertion to help TypeScript understand that flight is defined
  const flightData = flight as FlightRequest;

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
              Flight Request Details
            </h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {flightData.requester_handle}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDateTime(flightData.submitted_at)}
              </span>
            </div>
          </div>
          <StatusBadge status={flightData.status} />
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
                  <div className="text-2xl font-mono font-bold">{flightData.origin_icao.toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {flightData.origin_city}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-px bg-border flex-1"></div>
                  <Plane className="w-6 h-6 mx-3 text-primary" />
                  <div className="h-px bg-border flex-1"></div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-2xl font-mono font-bold">{flightData.destination_icao.toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {flightData.destination_city}
                  </div>
                </div>
              </div>

              {(flightData.airline || flightData.aircraft || flightData.sim) && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  {flightData.airline && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Airline:</span>
                      <span className="font-medium">{flightData.airline}</span>
                    </div>
                  )}
                  {flightData.aircraft && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aircraft:</span>
                      <span className="font-medium">{flightData.aircraft}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Simulator:</span>
                    <span className="font-medium">{flightData.sim}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {flightData.notes_public && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Requester Notes</h2>
              <p className="text-muted-foreground leading-relaxed">
                "{flightData.notes_public}"
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
                        {link.platform} • Published {formatDateTime(link.published_at)}
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
                .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())
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
                      {event.to_status.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(event.changed_at)}
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
                <span>{formatDateTime(flightData.submitted_at)}</span>
              </div>
              
              {flightData.platform && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <Badge variant="outline" className="capitalize">
                    {flightData.platform}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span>{flightData.priority}/5</span>
              </div>
              
              {flightData.eta && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA:</span>
                  <span>{formatDateTime(flightData.eta)}</span>
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
          
          {/* Social Media Links */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Follow @ThrottleAndFlaps</h3>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                <a href="https://tiktok.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  <TikTokIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">TikTok</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                <a href="https://instagram.com/throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  <InstagramIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                <a href="https://youtube.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  <YouTubeIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}