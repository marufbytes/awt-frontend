import axios from 'axios';
import { http } from '@/lib/http';
import type {
  ApplicationStatus,
  NewReferralPostForm,
  ReferralPost,
  ReferralPostStatus,
  StudentApplicationView,
  UnplacedStudent,
} from '@/lib/alumni/types';

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

function toUiStatus<T extends string>(status: string): T {
  return status.toUpperCase() as T;
}
function toApiStatus(status: string): string {
  return status.toLowerCase();
}

interface RawUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface RawReferralPost {
  id: number;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requiredSkills: string[];
  vacancies: number;
  deadline: string;
  status: string;
  createdAt: string;
  suggestedStudents: RawUser[];
}

interface RawReferralApplication {
  id: number;
  status: string;
  responseMessage: string | null;
  appliedAt: string;
  student: RawUser;
  referralPost: RawReferralPost;
}

interface RawUnplacedStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  applicationCount: number;
  resumeUrl: string | null;
}

function toReferralPost(raw: RawReferralPost): ReferralPost {
  return {
    id: raw.id,
    title: raw.title,
    companyName: raw.companyName,
    location: raw.location,
    description: raw.description,
    requiredSkills: raw.requiredSkills,
    vacancies: raw.vacancies,
    deadline: raw.deadline,
    status: toUiStatus<ReferralPostStatus>(raw.status),
    suggestedStudentIds: raw.suggestedStudents.map((s) => s.id),
    createdAt: raw.createdAt.slice(0, 10),
  };
}

export async function getUnplacedStudents(): Promise<UnplacedStudent[]> {
  const raw = await request<RawUnplacedStudent[]>('/alumni/students/unplaced');
  return raw.map((s) => ({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    email: s.email,
    skills: s.skills,
    applicationCount: s.applicationCount,
    resumeUrl: s.resumeUrl,
  }));
}

export async function getMyReferralPosts(): Promise<ReferralPost[]> {
  const raw = await request<RawReferralPost[]>('/alumni/posts/mine');
  return raw.map(toReferralPost);
}

export async function createReferralPost(
  form: NewReferralPostForm,
): Promise<ReferralPost> {
  const raw = await request<RawReferralPost>('/alumni/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: form.title.trim(),
      companyName: form.companyName.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      requiredSkills: form.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0),
      vacancies: form.vacancies,
      deadline: form.deadline,
      suggestedStudentIds: form.suggestedStudentIds,
    }),
  });

  return toReferralPost(raw);
}

export async function getStudentApplications(): Promise<StudentApplicationView[]> {
  const [rawApplications, unplacedStudents] = await Promise.all([
    request<RawReferralApplication[]>('/alumni/applications'),
    request<RawUnplacedStudent[]>('/alumni/students/unplaced'),
  ]);

  const profileByStudentId = new Map(unplacedStudents.map((s) => [s.id, s]));

  return rawApplications.map((raw) => {
    const post = toReferralPost(raw.referralPost);
    const profile = profileByStudentId.get(raw.student.id);

    return {
      id: raw.id,
      studentId: raw.student.id,
      referralPostId: post.id,
      status: toUiStatus<ApplicationStatus>(raw.status),
      appliedAt: raw.appliedAt.slice(0, 10),
      responseMessage: raw.responseMessage,
      post,
      student: {
        id: raw.student.id,
        firstName: raw.student.firstName,
        lastName: raw.student.lastName,
        email: raw.student.email,
        skills: profile?.skills ?? [],
        applicationCount: profile?.applicationCount ?? 0,
        resumeUrl: profile?.resumeUrl ?? null,
      },
    };
  });
}

export async function getAcceptedApplicationCount(): Promise<number> {
  return request<number>('/alumni/applications/accepted-count');
}

export async function respondToApplication(
  applicationId: number,
  decision: Extract<ApplicationStatus, 'ACCEPTED' | 'REJECTED'>,
  responseMessage?: string,
): Promise<void> {
  await request(`/alumni/applications/${applicationId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: toApiStatus(decision),
      responseMessage,
    }),
  });
}

export const VACANCY_FULL_MESSAGE =
  "Thanks for your interest — we've already accepted enough students for this vacancy. We'll keep your profile in mind for future openings.";

export function isPostFull(
  referralPostId: number,
  applications: StudentApplicationView[],
): boolean {
  const post = applications.find((a) => a.referralPostId === referralPostId)?.post;
  if (!post) return false;

  const acceptedForPost = applications.filter(
    (a) => a.referralPostId === referralPostId && a.status === 'ACCEPTED',
  ).length;

  return acceptedForPost >= post.vacancies;
}
