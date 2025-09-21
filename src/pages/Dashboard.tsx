import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlightCard } from '@/components/FlightCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useAllFlightsForAdmin, useDashboardStats } from '@/hooks/useFlights';
import { useIsAdmin } from '@/hooks/useAdmin';

type FlightStatus = Database['public']['Tables']['flight_requests']['Row']['status'];
import { 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Settings,
  LogOut,
  RefreshCw,
  Loader2
} from 'lucide-react';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState<FlightStatus | 'all'>('all');
  const { user, signOut } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  // Fetch flights and stats using React Query
  const { data: flights = [], isLoading, error, refetch } = useAllFlightsForAdmin();
  const { data: stats } = useDashboardStats();

  const statusColumns: { status: FlightStatus; label: string }[] = [
    { status: 'requested', label: 'Requested' },
    { status: 'queued', label: 'Queued' },
    { status: 'planning', label: 'Planning' },
    { status: 'underway', label: 'Underway' },
    { status: 'edited', label: 'Edited' },
    { status: 'published', label: 'Published' },
  ];

  const getFlightsByStatus = (status: FlightStatus) => {
    return flights.filter(flight => flight.status === status);
  };

  const getTotalsByStatus = () => {
    return statusColumns.reduce((acc, col) => {
      acc[col.status] = getFlightsByStatus(col.status).length;
      return acc;
    }, {} as Record<FlightStatus, number>);
  };

  const totals = stats || getTotalsByStatus();

  const handleRefresh = () => {
    refetch();
  };

  // Show admin dashboard only for authenticated admin users
  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this dashboard. Please sign in with an admin account.
          </p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  // Show error state if there's an error loading flights
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-4">Error Loading Flights</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the flight data. Please try again.
          </p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-semibold">Admin Dashboard</h1>
            <Badge variant="default" className="bg-red-500 w-fit">ADMIN</Badge>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Welcome back, {user?.email?.split('@')[0] || 'Admin'} • Manage and track all flight requests
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            <span className="sm:hidden">{isLoading ? '...' : '↻'}</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Link to="/profile" className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={signOut} className="flex-1 sm:flex-none">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-semibold">{stats?.total || flights.length}</p>
            </div>
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-semibold">
                {(stats?.planning || 0) + (stats?.underway || 0) + (stats?.edited || 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-semibold">{stats?.published || totals.published}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-semibold">
                {Math.round(((stats?.published || totals.published) / Math.max(stats?.total || flights.length, 1)) * 100)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Flight Queue Management</h2>
          <div className="text-sm text-muted-foreground">
            Click on flights to view details and manage status
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All ({flights.length})
          </Button>
          {statusColumns.map(col => (
            <Button
              key={col.status}
              variant={selectedStatus === col.status ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedStatus(col.status)}
            >
              {col.label} ({totals[col.status]})
            </Button>
          ))}
        </div>

        {/* Flights List/Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                Loading flights...
              </div>
            </Card>
          ) : selectedStatus === 'all' ? (
            // Show all flights grouped by status
            statusColumns.map(col => {
              const flights = getFlightsByStatus(col.status);
              if (flights.length === 0) return null;
              
              return (
                <div key={col.status}>
                  <div className="flex items-center gap-3 mb-3">
                    <StatusBadge status={col.status} />
                    <span className="text-sm text-muted-foreground">
                      {flights.length} flight{flights.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flights.map(flight => (
                      <FlightCard key={flight.id} flight={flight} onUpdate={handleRefresh} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show flights for selected status only
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFlightsByStatus(selectedStatus as FlightStatus).map(flight => (
                <FlightCard key={flight.id} flight={flight} onUpdate={handleRefresh} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {selectedStatus !== 'all' && getFlightsByStatus(selectedStatus as FlightStatus).length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              No flights with "{selectedStatus}" status yet.
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            Bulk Status Update
          </Button>
          <Button variant="outline" size="sm">
            Send Notifications
          </Button>
          <Button variant="outline" size="sm">
            Analytics Report
          </Button>
        </div>
      </Card>

      {/* Admin Info */}
      <Card className="mt-6 p-4 bg-green-50 border-green-200">
        <p className="text-sm text-green-700">
          <strong>Admin Access:</strong> You are logged in as an administrator. 
          This dashboard shows all flight requests and allows you to manage the flight queue.
        </p>
      </Card>
    </div>
  );
}