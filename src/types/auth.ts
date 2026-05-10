export interface User {
  user_id: string;
  client_id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthDate?: string;
  houseNumber?: string;
  street?: string;
  barangay?: string;
  city?: string;
  country?: string;
  gender?: string;
  contactNumber?: string;
  email: string;
  role: string;
  profilePic?: string;
  isPasswordChanged?: boolean;
  created_at?: string;
}

export interface LoginResult {
  user: User | null;
  requiresPasswordReset?: boolean;
  resetToken?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<User | null>;
  setAuthenticatedUser: (user: User | null) => void;
}
