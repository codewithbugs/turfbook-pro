import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    const roleHome =
      role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/';
    return <Navigate to={roleHome} replace />;
  }

  return <>{children}</>;
}
