import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Plane, PlusCircle, LayoutDashboard, LogIn, LogOut, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-sky rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-lg">Flight Requests</div>
              <div className="text-xs text-muted-foreground">@ThrottleAndFlaps</div>
            </div>
            <div className="sm:hidden">
              <div className="font-semibold text-sm">Flights</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
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

          {/* Desktop Authentication */}
          <div className="hidden lg:block ml-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Signed in
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Auth Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Signed in
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="p-2">
                <Link to="/auth">
                  <LogIn className="w-4 h-4" />
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Navigation</h3>
                    <div className="space-y-2">
                      <Button
                        asChild
                        variant={isActive('/') ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Link to="/" className="flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          Flights Feed
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant={isActive('/submit') ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Link to="/submit" className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4" />
                          Request Flight
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant={isActive('/about') ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Link to="/about" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          About
                        </Link>
                      </Button>

                      {user && (
                        <Button
                          asChild
                          variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <Link to="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}