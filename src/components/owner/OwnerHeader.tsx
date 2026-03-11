import { useAuth } from '@/lib/auth-context';
import { store, useStore } from '@/lib/store';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

export const OwnerHeader = () => {
  const { user, logout } = useAuth();
  const { notifications } = useStore();

  const unreadCount = useMemo(() => store.getUnreadCount(), [notifications]);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Left side: page title area */}
      <div />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-emerald-600">
                  {user?.name?.charAt(0) || 'O'}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-foreground">{user?.name || 'Turf Owner'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
