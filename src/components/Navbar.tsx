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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { store, useStore } from '@/lib/store';
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

export default function Navbar() {
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
      'relative px-1 py-2 text-sm font-medium transition-colors',
      isActive(path)
        ? 'text-emerald-600'
        : 'text-gray-600 hover:text-emerald-600',
      isActive(path) &&
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:rounded-full'
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TK</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              TurfBook
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Karo
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
          <div className="hidden md:flex items-center gap-3">
            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">{selectedCity}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Select City</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={cn(
                      'cursor-pointer',
                      selectedCity === city && 'bg-emerald-50 text-emerald-700'
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
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-gray-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-3 py-2">
                      <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={cn(
                            'flex items-start gap-3 px-3 py-2.5 cursor-pointer',
                            !notif.read && 'bg-emerald-50/50'
                          )}
                          asChild
                        >
                          <Link to={notif.link || '#'}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    'text-sm truncate',
                                    !notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'
                                  )}
                                >
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
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
                                className="flex-shrink-0 p-1 rounded hover:bg-emerald-100 text-gray-400 hover:text-emerald-600"
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
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {/* Book a Turf CTA for users */}
                {role === 'user' && (
                  <Link to="/turfs">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      Book a Turf
                    </Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 pl-1.5">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-3 w-3 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user?.name}</span>
                        <span className="text-xs text-gray-500 font-normal capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {/* City Selector Mobile */}
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium focus:outline-none"
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
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Home
            </Link>
            <Link
              to="/turfs"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/turfs')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
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
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive('/bookings')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
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
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(role === 'admin' ? '/admin' : '/owner')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                {/* Notifications Mobile */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-emerald-600 font-medium"
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
                          'block p-2 rounded-lg text-xs',
                          !notif.read ? 'bg-emerald-50' : 'bg-gray-50'
                        )}
                      >
                        <span className={cn('font-medium', !notif.read && 'text-gray-900')}>
                          {notif.title}
                        </span>
                        <p className="text-gray-500 mt-0.5">{notif.message}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <div className="px-3 py-2 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
