export interface User {
  id?: string;
  client_id?: string;
  username: string;
  fname: string;
  mname?: string;
  lname: string;
  suffix?: string;
  birthdate?: string;
  house_no?: string;
  street_name?: string;
  barangay?: string;
  city?: string;
  country?: string;
  gender?: string;
  contact_number?: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  verifyToken: () => Promise<void>;
  setAuthenticatedUser: (user: User | null) => void;
}
