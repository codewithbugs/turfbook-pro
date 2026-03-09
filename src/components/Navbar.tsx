import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, MapPin, ChevronDown, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isOwner, isAdmin } = useAuth();
  const isUser = isAuthenticated && !isOwner && !isAdmin;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/turfs', label: 'Browse Turfs' },
  ];

  // Only show "My Bookings" to end users
  if (isUser) {
    navLinks.push({ href: '/bookings', label: 'My Bookings' });
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isOwner) return '/owner';
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">T</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">TurfBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Mumbai
            </Button>

            {isAuthenticated ? (
              <>
                {isUser && (
                  <Link to="/turfs">
                    <Button variant="outline" size="sm">
                      Book Turf
                    </Button>
                  </Link>
                )}
                {dashboardLink && (
                  <Link to={dashboardLink}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      {isAdmin ? 'Admin' : 'My Dashboard'}
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm">{user?.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {isUser && (
                      <DropdownMenuItem asChild>
                        <Link to="/bookings" className="gap-2">
                          <Calendar className="w-4 h-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {dashboardLink && (
                      <DropdownMenuItem asChild>
                        <Link to={dashboardLink} className="gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors py-2",
                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    {isUser && (
                      <Link to="/turfs" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Book Turf</Button>
                      </Link>
                    )}
                    {dashboardLink && (
                      <Link to={dashboardLink} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" className="w-full gap-2" onClick={() => { logout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      Logout ({user?.name?.split(' ')[0]})
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
