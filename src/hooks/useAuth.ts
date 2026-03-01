import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  authenticated: boolean;
  userId: string | null;
  loading: boolean;
}

export function useAuth(serverAuthenticated?: boolean) {
  const [auth, setAuth] = useState<AuthState>({
    authenticated: serverAuthenticated ?? false,
    userId: null,
    loading: !serverAuthenticated,
  });

  useEffect(() => {
    // If server already told us we're authenticated, still fetch userId
    // If not, check client-side
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        setAuth({
          authenticated: data.authenticated ?? false,
          userId: data.userId ?? null,
          loading: false,
        });
      } catch {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    })();
  }, []);

  const login = useCallback((provider: 'google' | 'apple') => {
    window.location.href = `/api/auth/${provider}/login`;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }, []);

  return { ...auth, login, logout };
}
