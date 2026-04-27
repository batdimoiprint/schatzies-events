import { useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { login, verifyToken } from '@/api/auth';
import { AuthContext } from './AuthContext';
import type { User } from '@/types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  const checkToken = async (showError = false): Promise<User | null> => {
    try {
      if (showError) setError(null);
      const verifiedUser = await verifyToken();
      setUser(verifiedUser ?? null);

      // Persist a small flag in localStorage to help survive 429s on refresh
      if (verifiedUser) {
        localStorage.setItem('auth_hint', 'true');
      } else {
        localStorage.removeItem('auth_hint');
      }

      return verifiedUser ?? null;
    } catch (err: any) {
      const status = err?.response?.status;

      // If we get a 429 (Too Many Requests), don't force logout
      // if we have a hint that the user was previously authenticated.
      if (status === 429 && localStorage.getItem('auth_hint') === 'true') {
        console.warn('Rate limit hit during auth check, maintaining session hint.');
        return user; // Keep current user state
      }

      console.error('Token verification failed:', err);
      setUser(null);
      localStorage.removeItem('auth_hint');

      if (showError) {
        setError(err instanceof Error ? err.message : 'Failed to verify session');
      }
      return null;
    }
  };

  const handleLogin = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return loggedInUser;
      }
      // Fallback to token verification if login doesn't return user
      return await checkToken();
    } catch (err: unknown) {
      setUser(null);

      const status =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 401 || status === 400) {
        setError('Invalid email or password.');
      } else {
        setError(err instanceof Error ? err.message : 'Unable to login');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify token on app initialization
  useEffect(() => {
    if (isInitializedRef.current) return;

    const initializeSession = async () => {
      isInitializedRef.current = true;
      try {
        // Don't show error for background initialization check
        await checkToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const verifyTokenCallback = useCallback(async () => {
    setIsLoading(true);
    try {
      const verifiedUser = await checkToken();
      return verifiedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: handleLogin,
    setAuthenticatedUser: (nextUser: User | null) => {
      setError(null);
      setUser(nextUser);
    },
    verifyToken: verifyTokenCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
