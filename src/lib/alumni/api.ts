// src/lib/alumni/api.ts
import {
  MOCK_CURRENT_ALUMNI,
  MOCK_REFERRAL_POSTS,
  MOCK_UNPLACED_STUDENTS,
} from '@/lib/alumni/mockData';
import type {
  NewReferralPostForm,
  ReferralPost,
  UnplacedStudent,
} from '@/lib/alumni/types';

/** Pretend a network round-trip took `ms` milliseconds. */
function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * In-memory copy of the posts so a post created during this browser session
 * shows up on the "My Posts" page. Resets on page reload — that is fine for a
 * mock backend.
 */
let referralPosts: ReferralPost[] = [...MOCK_REFERRAL_POSTS];

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
