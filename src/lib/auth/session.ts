import type { AuthUser, LoginResponse, UserRole } from '@/lib/auth/types';

const STORAGE_KEY = 'innc.auth';

interface StoredSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function storeSession(session: LoginResponse): void {
  if (typeof window === 'undefined') return;
  const toStore: StoredSession = {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
}

export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function updateSessionCompany(company: { id: number; name: string }): void {
  const session = getSession();
  if (!session) return;
  session.user = { ...session.user, company };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'ALUMNI':
      return '/dashboard/alumni';
    case 'HR':
      return '/dashboard/company';
    case 'ADMIN':
      return '/dashboard/admin';
  }
}
