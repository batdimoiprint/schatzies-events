import axiosInstance from './axios-instance';
import type { User } from '@/types/auth';

export const login = async (email: string, password: string): Promise<User | null> => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });

  if (response.data && response.data.user) {
    return response.data.user;
  }

  return null;
};

export const verifyToken = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/auth/validate-token');
    return response.data.user;
  } catch (error: unknown) {
    const status =
      typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 401) {
      return null;
    }

    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch {
    // Some environments invalidate session through cookie expiration only.
  }
};
