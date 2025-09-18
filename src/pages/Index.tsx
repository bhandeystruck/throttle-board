import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FlightCard } from '@/components/FlightCard';
import { FilterBar } from '@/components/FilterBar';
import { mockFlights } from '@/data/mockData';
import { FilterOptions } from '@/types/flight';
import { Plane, PlusCircle } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: 'newest' });

  const filteredFlights = useMemo(() => {
    let filtered = [...mockFlights].filter(flight => flight.visibility === 'public');

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(flight => filters.status!.includes(flight.status));
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(flight => 
        flight.originIcao.toLowerCase().includes(searchLower) ||
        flight.originCity.toLowerCase().includes(searchLower) ||
        flight.destinationIcao.toLowerCase().includes(searchLower) ||
        flight.destinationCity.toLowerCase().includes(searchLower) ||
        flight.airline?.toLowerCase().includes(searchLower) ||
        flight.aircraft?.toLowerCase().includes(searchLower) ||
        flight.requesterHandle.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
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
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-sky border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Flight Requests Tracker
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Submit your dream flight routes and watch them come to life on <strong>@ThrottleAndFlaps</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/submit" className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Request a Flight
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Now Playing Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Now Playing & Up Next</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFlights
              .filter(f => ['underway', 'edited'].includes(f.status))
              .slice(0, 3)
              .map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
          </div>
          {mockFlights.filter(f => ['underway', 'edited'].includes(f.status)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No flights currently in progress. Check back soon!
            </div>
          )}
        </div>

        {/* All Flight Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">All Flight Requests</h2>
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
          <Button asChild size="lg">
            <Link to="/submit" className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Submit Flight Request
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
