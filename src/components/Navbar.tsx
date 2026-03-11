import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  MapPin,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Calendar,
  Bell,
  Check,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Notification } from '@/lib/types';

const cities = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed',
    message: 'Your booking at Green Arena Sports Complex has been confirmed.',
    type: 'booking',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/bookings',
  },
  {
    id: 'notif-2',
    title: 'New Turf Available',
    message: 'Premier Turf Club in Bangalore is now open for bookings.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/turfs',
  },
  {
    id: 'notif-3',
    title: 'Booking Reminder',
    message: 'You have a booking tomorrow at 6:00 PM.',
    type: 'booking',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/bookings',
  },
];

export function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const storeState = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    cn(
      'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
      isActive(path)
        ? 'text-primary bg-primary/10'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    );

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground">
              TurfBook
              <span className="text-gradient">Karo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/turfs" className={navLinkClass('/turfs')}>
              Browse Turfs
            </Link>
            {isAuthenticated && role === 'user' && (
              <Link to="/bookings" className={navLinkClass('/bookings')}>
                My Bookings
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{selectedCity}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-card border-border">
                <DropdownMenuLabel className="text-foreground">Select City</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={cn(
                      'cursor-pointer',
                      selectedCity === city && 'bg-primary/10 text-primary'
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-2" />
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-card border-border">
                    <div className="flex items-center justify-between px-3 py-2">
                      <DropdownMenuLabel className="p-0 text-foreground">Notifications</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-border" />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={cn(
                            'flex items-start gap-3 px-3 py-2.5 cursor-pointer',
                            !notif.read && 'bg-primary/5'
                          )}
                          asChild
                        >
                          <Link to={notif.link || '#'}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    'text-sm truncate',
                                    !notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground'
                                  )}
                                >
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {formatTimeAgo(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="flex-shrink-0 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dashboard button for owner/admin */}
                {(role === 'owner' || role === 'admin') && (
                  <Link to={role === 'admin' ? '/admin' : '/owner'}>
                    <Button variant="outline" size="sm" className="gap-1.5 border-border text-foreground hover:bg-secondary">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {/* Book a Turf CTA for users */}
                {role === 'user' && (
                  <Link to="/turfs">
                    <Button variant="hero" size="sm">
                      Book a Turf
                    </Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 pl-1.5 hover:bg-secondary">
                      <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-foreground text-xs font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                        <span className="text-xs text-muted-foreground font-normal capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    {role === 'user' && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/bookings" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(role === 'owner' || role === 'admin') && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          to={role === 'admin' ? '/admin' : '/owner'}
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {/* City Selector Mobile */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/50 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium focus:outline-none text-foreground flex-1"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              Home
            </Link>
            <Link
              to="/turfs"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive('/turfs')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              Browse Turfs
            </Link>

            {isAuthenticated && (
              <>
                {role === 'user' && (
                  <Link
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive('/bookings')
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    My Bookings
                  </Link>
                )}

                {(role === 'owner' || role === 'admin') && (
                  <Link
                    to={role === 'admin' ? '/admin' : '/owner'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive(role === 'admin' ? '/admin' : '/owner')
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                {/* Notifications Mobile */}
                <div className="px-3 py-3 mt-1 rounded-xl bg-secondary/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary font-medium hover:text-primary/80"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {notifications.slice(0, 3).map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link || '#'}
                        onClick={() => {
                          markAsRead(notif.id);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'block p-2.5 rounded-lg text-xs transition-colors',
                          !notif.read
                            ? 'bg-primary/5 border border-primary/10'
                            : 'bg-secondary/50'
                        )}
                      >
                        <span className={cn('font-medium', !notif.read ? 'text-foreground' : 'text-muted-foreground')}>
                          {notif.title}
                        </span>
                        <p className="text-muted-foreground mt-0.5">{notif.message}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border mt-3 pt-3">
                  <div className="px-3 py-2 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-foreground text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-border mt-3">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
