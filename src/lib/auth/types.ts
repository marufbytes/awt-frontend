
export type UserRole = 'STUDENT' | 'ALUMNI' | 'HR' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  company?: { id: number; name: string } | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
