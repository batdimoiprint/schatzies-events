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
  inquiryId?: string;
  profilePic?: string | File;
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
  profilePic?: string;
  isPasswordChanged?: boolean;
  created_at: string;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosInstance.get('/users');
  return response.data.users;
};

export const getOrganizerUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosInstance.get('/users');
  const users: UserResponse[] = response.data.users || [];

  return users.filter((user) => {
    const normalizedRole = String(user.role || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

    return normalizedRole === 'ORGANIZER';
  });
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.user;
};

export const createUser = async (payload: UserPayload): Promise<UserResponse> => {
  const response = await axiosInstance.post('/users', payload);
  return response.data.user;
};

export const updateUser = async (
  userId: string,
  payload: Partial<UserPayload> | FormData
): Promise<UserResponse> => {
  const isFormData = payload instanceof FormData;
  const response = await axiosInstance.patch(`/users/${userId}`, payload, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}`);
};

export const replacePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string; user: UserResponse }> => {
  const response = await axiosInstance.patch(`/users/${userId}/replace-password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};
