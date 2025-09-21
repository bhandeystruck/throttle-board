import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle, 
  TrendingUp,
  Calendar,
  MapPin,
  User,
  BarChart3,
  Eye,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useUserFlights } from '@/hooks/useFlights';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Database } from '@/integrations/supabase/types';
import { Navigate } from 'react-router-dom';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];

export default function UserDashboard() {
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: userFlights, isLoading, error } = useUserFlights();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('UserDashboard Debug:', {
      userId: user?.id,
      userFlights: userFlights,
      userFlightsLength: userFlights?.length,
      error: error
    });
  }

  // Redirect admin users to admin dashboard
  if (!adminLoading && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Calculate statistics
  const stats = {
    total: userFlights?.length || 0,
    published: userFlights?.filter(f => f.status === 'published').length || 0,
    underway: userFlights?.filter(f => f.status === 'underway').length || 0,
    requested: userFlights?.filter(f => f.status === 'requested').length || 0,
    declined: userFlights?.filter(f => f.status === 'declined').length || 0,
  };

  // Filter flights by status
  const filteredFlights = userFlights?.filter(flight => {
    if (selectedStatus === 'all') return true;
    return flight.status === selectedStatus;
  }) || [];

  // Sort flights by submission date (newest first)
  const sortedFlights = [...filteredFlights].sort((a, b) => 
    new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! 
              Track your flight requests and see your progress.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-muted-foreground mt-1">
                Debug: User ID: {user?.id || 'No user ID'}
              </p>
            )}
          </div>
          <Button asChild>
            <Link to="/submit" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">{stats.published}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Underway</p>
              <p className="text-2xl font-bold">{stats.underway}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested</p>
              <p className="text-2xl font-bold">{stats.requested}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Declined</p>
              <p className="text-2xl font-bold">{stats.declined}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Link to="/submit">
              <PlusCircle className="w-6 h-6" />
              <span>Submit New Request</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Link to="/">
              <Eye className="w-6 h-6" />
              <span>Browse All Flights</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Link to="/about">
              <User className="w-6 h-6" />
              <span>Learn More</span>
            </Link>
          </Button>
        </div>
      </Card>

      {/* Flight Requests */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Filter Requests</h3>
            <div className="space-y-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedStatus('all')}
              >
                All Requests ({stats.total})
              </Button>
              <Button
                variant={selectedStatus === 'published' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedStatus('published')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Published ({stats.published})
              </Button>
              <Button
                variant={selectedStatus === 'underway' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedStatus('underway')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Underway ({stats.underway})
              </Button>
              <Button
                variant={selectedStatus === 'requested' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedStatus('requested')}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Requested ({stats.requested})
              </Button>
              <Button
                variant={selectedStatus === 'declined' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedStatus('declined')}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Declined ({stats.declined})
              </Button>
            </div>
          </Card>
        </div>

        {/* Flight List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Flight Requests</h2>
            <Badge variant="outline">
              {sortedFlights.length} of {stats.total}
            </Badge>
          </div>

          {sortedFlights.length === 0 ? (
            <Card className="p-8 text-center">
              <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {selectedStatus === 'all' ? 'No flight requests yet' : `No ${selectedStatus} requests`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedStatus === 'all' 
                  ? 'Start by submitting your first flight request!'
                  : `You don't have any ${selectedStatus} flight requests.`
                }
              </p>
              {selectedStatus === 'all' && (
                <Button asChild>
                  <Link to="/submit" className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Submit Your First Request
                  </Link>
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedFlights.map((flight) => (
                <Card key={flight.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={flight.status} />
                      <span className="text-sm text-muted-foreground">
                        Submitted {formatDate(flight.submitted_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/request/${flight.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {flight.status === 'requested' && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/request/${flight.id}`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="font-mono text-lg font-semibold">{flight.origin_icao.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{flight.origin_city}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="h-px bg-border flex-1"></div>
                      <Plane className="w-4 h-4 mx-2 text-primary" />
                      <div className="h-px bg-border flex-1"></div>
                    </div>

                    <div className="text-center">
                      <div className="font-mono text-lg font-semibold">{flight.destination_icao.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{flight.destination_city}</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {flight.airline && (
                      <span className="flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        {flight.airline}
                      </span>
                    )}
                    {flight.aircraft && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {flight.aircraft}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Priority: {flight.priority}
                    </span>
                  </div>

                  {flight.notes_public && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{flight.notes_public}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
