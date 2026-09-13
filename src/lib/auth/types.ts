// src/lib/auth/types.ts

/** Mirrors the backend's UserRole enum (src/user/entities/user.entity.ts). */
export type UserRole = 'STUDENT' | 'ALUMNI' | 'HR' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
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
