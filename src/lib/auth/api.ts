import axios from 'axios';
import { http } from '@/lib/http';
import type { LoginPayload, LoginResponse, RegisterPayload, AuthUser } from '@/lib/auth/types';

export class ApiError extends Error {
  messages: string[];

  constructor(messages: string[]) {
    super(messages.join(' '));
    this.name = 'ApiError';
    this.messages = messages;
  }
}

function extractMessages(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    if (Array.isArray(body?.message)) return body.message;
    if (typeof body?.message === 'string') return [body.message];
    if (error.response) return [`Request failed with status ${error.response.status}`];
  }
  return ['Network error. Please try again.'];
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { data } = await http.post<LoginResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw new ApiError(extractMessages(error));
  }
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  try {
    const { data } = await http.post<AuthUser>('/auth/register', payload);
    return data;
  } catch (error) {
    throw new ApiError(extractMessages(error));
  }
}
