import axiosInstance from './axios-instance';
import type { User } from '@/types/auth';

export type UserResponse = User;

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.user;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, userData);
  return response.data.user;
};
