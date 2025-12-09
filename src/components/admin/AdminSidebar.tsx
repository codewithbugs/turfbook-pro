import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'turfs', label: 'Manage Turfs', icon: MapPin, path: '/admin/turfs' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  
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
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-display font-bold text-foreground">TurfBook</span>
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
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
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
