import axiosInstance from './axios-instance';
import type { User, LoginResult } from '@/types/auth';

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });

  const data = response.data;

  // Backend signals a forced password reset (e.g. Cognito NEW_PASSWORD_REQUIRED)
  if (data?.challengeName === 'NEW_PASSWORD_REQUIRED' || data?.requiresPasswordReset) {
    return {
      user: null,
      requiresPasswordReset: true,
      resetToken: data.session || data.resetToken || null,
    };
  }

  return {
    user: data?.user ?? null,
    requiresPasswordReset: false,
    resetToken: null,
  };
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
