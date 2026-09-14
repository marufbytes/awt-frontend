import axios from 'axios';
import { API_URL, http } from '@/lib/http';
import type {
  ApplicationStatus,
  ApplicationView,
  Company,
  Interview,
  Internship,
  NewCompanyForm,
  NewInternshipForm,
} from '@/lib/company/types';

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

async function request<T>(path: string, init: { method?: string; body?: string } = {}): Promise<T> {
  try {
    const { data } = await http.request<T>({
      url: path,
      method: init.method ?? 'GET',
      data: init.body ? JSON.parse(init.body) : undefined,
    });
    return data;
  } catch (error) {
    throw new ApiError(extractMessages(error));
  }
}

export function resolveFileUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.replace(/\\/g, '/').replace(/^.*uploads\//, 'uploads/');
  return `${API_URL}/${normalized}`;
}

export async function getCompany(companyId: number): Promise<Company> {
  return request<Company>(`/company/${companyId}`);
}

export async function createCompany(form: NewCompanyForm): Promise<Company> {
  return request<Company>('/company', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}

export async function updateCompany(
  companyId: number,
  form: Partial<NewCompanyForm>,
): Promise<Company> {
  return request<Company>(`/company/${companyId}`, {
    method: 'PATCH',
    body: JSON.stringify(form),
  });
}

export async function getAllInternships(): Promise<Internship[]> {
  return request<Internship[]>('/internship');
}

export async function getMyInternships(companyId: number): Promise<Internship[]> {
  const all = await getAllInternships();
  return all.filter((i) => i.company?.id === companyId);
}

export async function createInternship(
  companyId: number,
  form: NewInternshipForm,
): Promise<Internship> {
  return request<Internship>('/internship', {
    method: 'POST',
    body: JSON.stringify({ ...form, companyId }),
  });
}

export async function updateInternship(
  id: number,
  form: Partial<NewInternshipForm & { isActive: boolean }>,
): Promise<Internship> {
  return request<Internship>(`/internship/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(form),
  });
}

export async function deleteInternship(id: number): Promise<void> {
  await request(`/internship/${id}`, { method: 'DELETE' });
}

export async function getAllApplications(): Promise<ApplicationView[]> {
  return request<ApplicationView[]>('/application');
}

export async function getMyApplications(companyId: number): Promise<ApplicationView[]> {
  const all = await getAllApplications();
  return all.filter((a) => a.internship.company?.id === companyId);
}

export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
): Promise<ApplicationView> {
  return request<ApplicationView>(`/application/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getAllInterviews(): Promise<Interview[]> {
  return request<Interview[]>('/interviews');
}

export async function getMyInterviews(companyId: number): Promise<Interview[]> {
  const all = await getAllInterviews();
  return all.filter((i) => i.application.internship.company?.id === companyId);
}
