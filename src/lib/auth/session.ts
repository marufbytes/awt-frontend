// src/lib/auth/session.ts
import type { AuthUser, LoginResponse, UserRole } from '@/lib/auth/types';

const STORAGE_KEY = 'innc.auth';

interface StoredSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/** Persist a freshly logged-in session to localStorage. */
export function storeSession(session: LoginResponse): void {
  if (typeof window === 'undefined') return;
  const toStore: StoredSession = {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
}

/** Read back the current session, if the user is logged in on this browser. */
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

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Where a logged-in user should land after auth, based on their role. */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'STUDENT':
      return '/dashboard/student';
    case 'ALUMNI':
      return '/dashboard/alumni';
    case 'HR':
      return '/dashboard/company';
    case 'ADMIN':
      return '/dashboard/admin';
  }
}
