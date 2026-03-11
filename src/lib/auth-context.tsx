import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AUTH0_ROLE_CLAIM } from './auth0-config';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (options?: { screen_hint?: string; connection?: string }) => void;
  loginWithPhone: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
  isUser: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Auth0 is configured with real credentials
const isAuth0Configured = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  return !!domain &&
    !!clientId &&
    domain !== 'your-tenant.auth0.com' &&
    clientId !== 'your-client-id';
};

const getMockIdentity = (email: string): Pick<User, 'id' | 'role' | 'name'> => {
  const normalized = email.trim().toLowerCase();

  if (normalized.includes('admin')) {
    return { id: 'admin-1', role: 'admin', name: 'Admin User' };
  }

  if (normalized === 'owner@example.com' || normalized.includes('owner')) {
    return { id: 'owner-1', role: 'owner', name: 'Turf Owner' };
  }

  if (normalized === 'rahul@example.com') {
    return { id: 'user-1', role: 'user', name: 'Rahul Sharma' };
  }

  return { id: 'user-1', role: 'user', name: 'Demo User' };
};

const buildMockUser = (email: string, provider: 'email' | 'google' | 'phone'): User => {
  const identity = getMockIdentity(email);
  return {
    id: identity.id,
    name: identity.name,
    email,
    phone: provider === 'phone' ? '+91 98765 43210' : '+91 90000 00000',
    role: identity.role,
    createdAt: new Date().toISOString(),
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth0 = useAuth0();
  const [mockUser, setMockUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('turfbookkaro_user');
    return saved ? JSON.parse(saved) : null;
  });

  const useRealAuth0 = isAuth0Configured();

  // Persist mock user to localStorage
  useEffect(() => {
    if (mockUser) {
      localStorage.setItem('turfbookkaro_user', JSON.stringify(mockUser));
    } else {
      localStorage.removeItem('turfbookkaro_user');
    }
  }, [mockUser]);

  // Register setter so mockLogin() can update context without full reload
  useEffect(() => {
    registerMockAuthSetter(setMockUser);
    return () => registerMockAuthSetter(() => {});
  }, []);

  // Map Auth0 user to our User type
  const mapAuth0User = useCallback((): User | null => {
    if (!useRealAuth0 || !auth0.user) return null;
    const roles: string[] = (auth0.user[AUTH0_ROLE_CLAIM] as string[]) || ['user'];
    const role: UserRole = roles.includes('admin')
      ? 'admin'
      : roles.includes('owner')
      ? 'owner'
      : 'user';

    return {
      id: auth0.user.sub || '',
      name: auth0.user.name || '',
      email: auth0.user.email || '',
      phone: auth0.user.phone_number || '',
      role,
      avatar: auth0.user.picture,
      createdAt: new Date().toISOString(),
    };
  }, [auth0.user, useRealAuth0]);

  const user = useRealAuth0 ? mapAuth0User() : mockUser;
  const isAuthenticated = useRealAuth0 ? auth0.isAuthenticated : !!mockUser;
  const isLoading = useRealAuth0 ? auth0.isLoading : false;
  const role: UserRole = user?.role || 'user';

  const login = useCallback(
    (options?: { screen_hint?: string; connection?: string }) => {
      if (useRealAuth0) {
        auth0.loginWithRedirect({
          authorizationParams: {
            screen_hint: options?.screen_hint || 'login',
            connection: options?.connection,
          },
        });
      } else {
        // Fallback mock login — navigate to /auth page
        window.location.href = '/auth';
      }
    },
    [auth0, useRealAuth0]
  );

  const loginWithPhone = useCallback(() => {
    if (useRealAuth0) {
      auth0.loginWithRedirect({
        authorizationParams: { connection: 'sms' },
      });
    } else {
      mockLogin(buildMockUser('user.phone@turfbookkaro.in', 'phone'));
    }
  }, [auth0, useRealAuth0]);

  const loginWithGoogle = useCallback(() => {
    if (useRealAuth0) {
      auth0.loginWithRedirect({
        authorizationParams: { connection: 'google-oauth2' },
      });
    } else {
      mockLogin(buildMockUser('user.google@turfbookkaro.in', 'google'));
    }
  }, [auth0, useRealAuth0]);

  const handleLogout = useCallback(() => {
    if (useRealAuth0) {
      auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      setMockUser(null);
      localStorage.removeItem('turfbookkaro_user');
      window.location.href = '/';
    }
  }, [auth0, useRealAuth0]);

  // Exposed for mock auth (Auth page uses this)
  const setUser = useCallback((u: User | null) => {
    setMockUser(u);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    loginWithPhone,
    loginWithGoogle,
    logout: handleLogout,
    isUser: role === 'user',
    isOwner: role === 'owner',
    isAdmin: role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      <MockAuthSetter setUser={setUser} />
      {children}
    </AuthContext.Provider>
  );
}

// Expose setUser for the Auth page (mock mode only)
const MockAuthSetterContext = createContext<((u: User | null) => void) | null>(null);

function MockAuthSetter({ setUser }: { setUser: (u: User | null) => void }) {
  return (
    <MockAuthSetterContext.Provider value={setUser}>
      {null}
    </MockAuthSetterContext.Provider>
  );
}

// This is intentionally not exported broadly — only the Auth page should use it
export function useMockAuthSetter() {
  // We need a different approach since the provider renders null children
  // Instead, we'll export a function from the store
  return null;
}

// Store reference to setUser for mock auth
let _mockSetUser: ((u: User | null) => void) | null = null;

export function registerMockAuthSetter(fn: (u: User | null) => void) {
  _mockSetUser = fn;
}

export function mockLogin(user: User) {
  if (_mockSetUser) {
    _mockSetUser(user);
  } else {
    localStorage.setItem('turfbookkaro_user', JSON.stringify(user));
    window.location.reload();
  }
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
