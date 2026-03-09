import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface OwnerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/owner', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/owner/turfs', label: 'My Turfs', icon: MapPin },
  { href: '/owner/bookings', label: 'Bookings', icon: Calendar },
  { href: '/owner/slots', label: 'Slot Management', icon: Clock },
];

export const OwnerSidebar = ({ collapsed, onToggle }: OwnerSidebarProps) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/owner') return location.pathname === '/owner';
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link to="/owner" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          {!collapsed && (
            <div>
              <span className="font-display font-bold text-foreground">TurfBook</span>
              <p className="text-xs text-muted-foreground">Turf Owner</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              isActive(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Exit Dashboard</span>}
        </Link>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
