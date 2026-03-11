import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { store } from '@/lib/store';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Settings,
  BarChart3,
  LogOut,
  ChevronLeft,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const pendingCount = store.getPendingTurfs().length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin', badge: 0 },
    { id: 'turfs', label: 'Manage Turfs', icon: MapPin, path: '/admin/turfs', badge: pendingCount },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings', badge: 0 },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', badge: 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics', badge: 0 },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings', badge: 0 },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-display font-bold text-foreground">TurfBookKaro</span>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <span className="font-medium flex-1">{item.label}</span>
            )}
            {!isCollapsed && item.badge > 0 && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                isActive(item.path)
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              )}>
                {item.badge}
              </span>
            )}
            {isCollapsed && item.badge > 0 && (
              <span className="absolute right-2 top-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to="/">
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-3", isCollapsed && "px-3")}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Exit Admin</span>}
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle}
          className="w-full"
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>
    </aside>
  );
};

export { AdminSidebar };
