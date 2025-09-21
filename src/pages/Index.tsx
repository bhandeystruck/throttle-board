import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FlightCard } from '@/components/FlightCard';
import { FilterBar } from '@/components/FilterBar';
import { useAuth } from '@/hooks/useAuth';
import { useFlights, useFlightsByStatus } from '@/hooks/useFlights';
import { Database } from '@/integrations/supabase/types';
import { Plane, PlusCircle, LogIn, Loader2 } from 'lucide-react';
import { TikTokIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons';

type FlightRequest = Database['public']['Tables']['flight_requests']['Row'];

interface FilterOptions {
  status?: string[];
  airline?: string[];
  aircraft?: string[];
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'eta';
}

const Index = () => {
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: 'newest' });
  const { user } = useAuth();
  
  // Fetch flights from database
  const { data: allFlights, isLoading, error } = useFlights();
  const { data: activeFlights } = useFlightsByStatus('underway');

  const filteredFlights = useMemo(() => {
    if (!allFlights) return [];
    
    let filtered: FlightRequest[] = [...allFlights];

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(flight => filters.status!.includes(flight.status));
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(flight => 
        flight.origin_icao.toLowerCase().includes(searchLower) ||
        flight.origin_city.toLowerCase().includes(searchLower) ||
        flight.destination_icao.toLowerCase().includes(searchLower) ||
        flight.destination_city.toLowerCase().includes(searchLower) ||
        flight.airline?.toLowerCase().includes(searchLower) ||
        flight.aircraft?.toLowerCase().includes(searchLower) ||
        flight.requester_handle.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
        break;
      case 'priority':
        filtered.sort((a, b) => b.priority - a.priority);
        break;
      case 'eta':
        filtered.sort((a, b) => {
          if (!a.eta && !b.eta) return 0;
          if (!a.eta) return 1;
          if (!b.eta) return -1;
          return new Date(a.eta).getTime() - new Date(b.eta).getTime();
        });
        break;
    }

    return filtered;
  }, [filters, allFlights]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading flights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading flights</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-sky border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Plane className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
              Flight Requests Tracker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
              Submit your dream flight routes and watch them come to life on <strong>@ThrottleAndFlaps</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/submit" className="flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Request a Flight
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/about" className="flex items-center justify-center gap-2">
                  <span>How It Works</span>
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Link to="/auth" className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4 mt-6">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <a href="https://tiktok.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <TikTokIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">TikTok</span>
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <a href="https://instagram.com/throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <a href="https://youtube.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <YouTubeIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Now Playing Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 px-2">Now Playing & Up Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFlights
              ?.filter((f: FlightRequest) => ['underway', 'edited'].includes(f.status))
              .slice(0, 3)
              .map((flight: FlightRequest) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
          </div>
          {allFlights?.filter((f: FlightRequest) => ['underway', 'edited'].includes(f.status)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground px-4">
              No flights currently in progress. Check back soon!
            </div>
          )}
        </div>

        {/* All Flight Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl md:text-2xl font-semibold">All Flight Requests</h2>
          </div>

          {/* Filters */}
          <FilterBar 
            onFiltersChange={setFilters}
            totalResults={filteredFlights.length}
          />

          {/* Flight Grid */}
          {filteredFlights.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No flights match your filters</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => setFilters({ sortBy: 'newest' })} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-runway p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">Ready to Request Your Flight?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join the community and see your favorite routes brought to life in Microsoft Flight Simulator 2024.
            From challenging approaches to scenic routes, every flight tells a story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/submit" className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Submit Flight Request
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="lg">
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In to Track Requests
                </Link>
              </Button>
            )}
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <a href="https://tiktok.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <TikTokIcon className="w-4 h-4" />
                <span className="hidden sm:inline">TikTok</span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <a href="https://instagram.com/throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <a href="https://youtube.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <YouTubeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">YouTube</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
