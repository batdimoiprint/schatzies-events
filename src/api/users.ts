import axiosInstance from './axios-instance';

export interface UserPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate?: string;
  houseNumber?: string;
  street?: string;
  barangay?: string;
  city?: string;
  country?: string;
  gender?: string;
  contactNumber?: string;
  role?: string;
}

export interface UserResponse {
  user_id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  birthDate: string;
  houseNumber: string;
  street: string;
  barangay: string;
  city: string;
  country: string;
  gender: string;
  contactNumber: string;
  role: string;
  created_at: string;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosInstance.get('/users');
  return response.data.users;
};

export const getOrganizerUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosInstance.get('/users/organizers');
  return response.data.users;
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.user;
};

export const createUser = async (payload: UserPayload): Promise<UserResponse> => {
  const response = await axiosInstance.post('/users', payload);
  return response.data.user;
};

export const updateUser = async (userId: string, payload: Partial<UserPayload>): Promise<UserResponse> => {
  const response = await axiosInstance.put(`/users/${userId}`, payload);
  return response.data.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}`);
};
