// src/lib/alumni/api.ts
import { getSession } from '@/lib/auth/session';
import type {
  ApplicationStatus,
  NewReferralPostForm,
  ReferralPost,
  ReferralPostStatus,
  StudentApplicationView,
  UnplacedStudent,
} from '@/lib/alumni/types';

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

/** Calls the real NestJS backend, attaching the logged-in alumni's JWT. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getSession();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessages(response));
  }

  return response.json() as Promise<T>;
}

// The backend stores statuses lowercase (`'pending'`, `'approved'`, ...) —
// see src/alumni/enums on the backend — but the UI works with uppercase ones.
// These two helpers translate at the API boundary so nothing else in the app
// has to think about casing.
function toUiStatus<T extends string>(status: string): T {
  return status.toUpperCase() as T;
}
function toApiStatus(status: string): string {
  return status.toLowerCase();
}

/** Shape of a bare user as embedded in alumni API responses (relations). */
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

/** Students from the alumni's university who still need an internship. */
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

/** Referral posts created by the currently logged-in alumni. */
export async function getMyReferralPosts(): Promise<ReferralPost[]> {
  const raw = await request<RawReferralPost[]>('/alumni/posts/mine');
  return raw.map(toReferralPost);
}

/**
 * Create a new referral post. It starts life as PENDING and waits for an admin
 * to approve it. Returns the created post.
 */
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

/**
 * Students who applied through one of the alumni's circulars, newest first,
 * joined with the student's profile and the post they applied to.
 *
 * `GET /alumni/applications` only returns the student's name/email, not their
 * skills or resume — those live on `GET /alumni/students/unplaced`, so this
 * joins the two client-side. Note: a student who has already been ACCEPTED no
 * longer shows up in the "unplaced" list, so their skills/resume link will be
 * missing here once they're accepted.
 */
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

/** How many students the alumni has accepted across all of their circulars so far. */
export async function getAcceptedApplicationCount(): Promise<number> {
  return request<number>('/alumni/applications/accepted-count');
}

/**
 * Accept or reject a student's application. The backend refuses an ACCEPTED
 * response once that post's own `vacancies` are already filled — check with
 * `isPostFull` first and send `VACANCY_FULL_MESSAGE` instead in that case.
 */
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

/** Canned note sent to a student once the vacancy has already filled up. */
export const VACANCY_FULL_MESSAGE =
  "Thanks for your interest — we've already accepted enough students for this vacancy. We'll keep your profile in mind for future openings.";

/**
 * Whether a referral post has already accepted as many students as it has
 * room for (each post's own `vacancies`, not a global cap).
 */
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
