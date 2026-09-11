// src/lib/alumni/api.ts
import {
  MOCK_CURRENT_ALUMNI,
  MOCK_REFERRAL_POSTS,
  MOCK_STUDENT_APPLICATIONS,
  MOCK_UNPLACED_STUDENTS,
} from '@/lib/alumni/mockData';
import type {
  ApplicationStatus,
  NewReferralPostForm,
  ReferralPost,
  StudentApplication,
  StudentApplicationView,
  UnplacedStudent,
} from '@/lib/alumni/types';

/** Pretend a network round-trip took `ms` milliseconds. */
function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Once an alumni has accepted this many students into a circular, any further
 * pending applications are treated as "vacancy full" instead of being open to
 * a normal accept.
 */
export const ACCEPTED_APPLICATIONS_CAP = 20;

/** Canned note sent to a student once the vacancy has already filled up. */
export const VACANCY_FULL_MESSAGE =
  "Thanks for your interest — we've already accepted enough students for this vacancy. We'll keep your profile in mind for future openings.";

/**
 * In-memory copy of the posts so a post created during this browser session
 * shows up on the "My Posts" page. Resets on page reload — that is fine for a
 * mock backend.
 */
let referralPosts: ReferralPost[] = [...MOCK_REFERRAL_POSTS];

/**
 * In-memory copy of the applications so an accept/reject during this browser
 * session sticks around while navigating the dashboard.
 */
let studentApplications: StudentApplication[] = [...MOCK_STUDENT_APPLICATIONS];

/** Students from the alumni's university who still need an internship. */
export async function getUnplacedStudents(): Promise<UnplacedStudent[]> {
  await delay();
  return [...MOCK_UNPLACED_STUDENTS];
}

/** Referral posts created by the currently logged-in alumni. */
export async function getMyReferralPosts(): Promise<ReferralPost[]> {
  await delay();
  // Newest first.
  return [...referralPosts].sort((a, b) => b.id - a.id);
}

/**
 * Create a new referral post. It starts life as PENDING and waits for an admin
 * to approve it. Returns the created post.
 */
export async function createReferralPost(
  form: NewReferralPostForm,
): Promise<ReferralPost> {
  await delay(800);

  const nextId =
    referralPosts.reduce((max, post) => Math.max(max, post.id), 0) + 1;

  const newPost: ReferralPost = {
    id: nextId,
    title: form.title.trim(),
    companyName: form.companyName.trim() || MOCK_CURRENT_ALUMNI.companyName,
    location: form.location.trim(),
    description: form.description.trim(),
    requiredSkills: form.requiredSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0),
    vacancies: form.vacancies,
    deadline: form.deadline,
    status: 'PENDING',
    suggestedStudentIds: [...form.suggestedStudentIds],
    createdAt: new Date().toISOString().slice(0, 10),
  };

  referralPosts = [newPost, ...referralPosts];
  return newPost;
}

/**
 * Students who applied through one of the alumni's circulars, newest first,
 * joined with the student's profile and the post they applied to.
 */
export async function getStudentApplications(): Promise<StudentApplicationView[]> {
  await delay();

  return studentApplications
    .map((app) => {
      const student = MOCK_UNPLACED_STUDENTS.find((s) => s.id === app.studentId);
      const post = referralPosts.find((p) => p.id === app.referralPostId);
      if (!student || !post) return null;
      return { ...app, student, post };
    })
    .filter((view): view is StudentApplicationView => view !== null)
    .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1));
}

/** How many students the alumni has accepted across all of their circulars so far. */
export async function getAcceptedApplicationCount(): Promise<number> {
  await delay(150);
  return studentApplications.filter((app) => app.status === 'ACCEPTED').length;
}

/**
 * Accept or reject a student's application. Accepting once 20 students have
 * already been accepted is refused — call this with `'REJECTED'` and the
 * `VACANCY_FULL_MESSAGE` instead so the student is told the vacancy filled up.
 */
export async function respondToApplication(
  applicationId: number,
  decision: Extract<ApplicationStatus, 'ACCEPTED' | 'REJECTED'>,
  responseMessage?: string,
): Promise<StudentApplication> {
  await delay(400);

  const acceptedCount = studentApplications.filter(
    (app) => app.status === 'ACCEPTED',
  ).length;

  if (decision === 'ACCEPTED' && acceptedCount >= ACCEPTED_APPLICATIONS_CAP) {
    throw new Error(
      `Cannot accept more students — the ${ACCEPTED_APPLICATIONS_CAP}-student vacancy is already full.`,
    );
  }

  let updated: StudentApplication | undefined;
  studentApplications = studentApplications.map((app) => {
    if (app.id !== applicationId) return app;
    updated = { ...app, status: decision, responseMessage: responseMessage ?? null };
    return updated;
  });

  if (!updated) throw new Error('Application not found.');
  return updated;
}
