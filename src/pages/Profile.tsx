import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Plane, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useUserFlights } from '@/hooks/useFlights';

export default function Profile() {
  const { user } = useAuth();
  const { data: userFlights, isLoading: flightsLoading, error: flightsError } = useUserFlights();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please sign in to view your profile</h1>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        
        <h1 className="text-3xl font-semibold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and flight requests</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {getUserInitials(user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.email?.split('@')[0] || 'User'}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/submit">Submit New Request</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flight Requests Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            My Flight Requests
            {userFlights && (
              <Badge variant="outline" className="ml-2">
                {userFlights.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {flightsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading your flight requests...</p>
            </div>
          ) : flightsError ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Error loading your flight requests.</p>
              <p className="text-sm mt-2">Please try again later.</p>
            </div>
          ) : userFlights && userFlights.length > 0 ? (
            <div className="space-y-4">
              {userFlights.slice(0, 5).map((flight) => (
                <div key={flight.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-mono text-sm font-semibold">{flight.origin_icao.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{flight.origin_city}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-px bg-border w-8"></div>
                      <Plane className="w-4 h-4 mx-2 text-primary" />
                      <div className="h-px bg-border w-8"></div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-sm font-semibold">{flight.destination_icao.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{flight.destination_city}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={flight.status} />
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(flight.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/request/${flight.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {userFlights.length > 5 && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Showing 5 of {userFlights.length} requests
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/">View All Requests</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>You haven't submitted any flight requests yet.</p>
              <p className="text-sm mt-2">
                Submit your first request to get started!
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/submit">Submit Your First Request</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
