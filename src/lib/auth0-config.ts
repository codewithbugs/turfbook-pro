// Auth0 configuration
// Replace these with your actual Auth0 credentials
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.turfbook.in',
    scope: 'openid profile email phone',
  },
};

// Role claim namespace (Auth0 custom claims must be namespaced)
export const AUTH0_ROLE_CLAIM = 'https://turfbook.in/roles';
export const AUTH0_METADATA_CLAIM = 'https://turfbook.in/user_metadata';
