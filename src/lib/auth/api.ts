// src/lib/auth/api.ts
import type { LoginPayload, LoginResponse, RegisterPayload, AuthUser } from '@/lib/auth/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Thrown when the backend rejects a request. `messages` holds every
 * validation message returned (class-validator can return several at once).
 */
export class ApiError extends Error {
  messages: string[];

  constructor(messages: string[]) {
    super(messages.join(' '));
    this.name = 'ApiError';
    this.messages = messages;
  }
}

async function parseErrorMessages(response: Response): Promise<string[]> {
  try {
    const body = await response.json();
    if (Array.isArray(body.message)) return body.message;
    if (typeof body.message === 'string') return [body.message];
  } catch {
    // Response wasn't JSON — fall through to the generic message below.
  }
  return [`Request failed with status ${response.status}`];
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessages(response));
  }

  return response.json();
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessages(response));
  }

  return response.json();
}
