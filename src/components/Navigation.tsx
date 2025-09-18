import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane, PlusCircle, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-sky rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-lg">Flight Requests</div>
              <div className="text-xs text-muted-foreground">@ThrottleAndFlaps</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={isActive('/') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/">
                Flights Feed
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive('/submit') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/submit" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Request Flight
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive('/about') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/about">
                About
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
              size="sm"
              className="ml-2"
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}