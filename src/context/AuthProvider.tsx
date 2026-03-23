import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '@/api/auth';
import { AuthContext } from './AuthContext';
import type { User } from '@/types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async () => {
    try {
      setError(null);
      const verifiedUser = await authAPI.verifyToken();
      setUser(verifiedUser ?? null);
    } catch (err) {
      console.error('Token verification failed:', err);
      setUser(null);
      setError(err instanceof Error ? err.message : 'Failed to verify session');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await authAPI.login(email, password);
      if (status === 200) {
        await verifyToken();
        return true;
      }
      return false;
    } catch (err: unknown) {
      setUser(null);

      const status =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err instanceof Error ? err.message : 'Unable to login');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify token on app initialization
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await verifyToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    setAuthenticatedUser: (nextUser: User | null) => {
      setError(null);
      setUser(nextUser);
    },
    verifyToken: async () => {
      setIsLoading(true);
      try {
        await verifyToken();
      } finally {
        setIsLoading(false);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
