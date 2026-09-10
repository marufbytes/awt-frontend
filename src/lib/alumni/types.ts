// src/lib/alumni/types.ts

/** A junior from the same university who has not landed an internship yet. */
export interface UnplacedStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  /** How many internships this student has applied to so far. */
  applicationCount: number;
  /** Link to an uploaded CV, or null when the student has not added one. */
  resumeUrl: string | null;
}

/** The three states an admin can leave a referral post in. */
export type ReferralPostStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

/** A referral an alumni has created for a vacancy at their company. */
export interface ReferralPost {
  id: number;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requiredSkills: string[];
  vacancies: number;
  /** ISO date string, e.g. "2026-10-15". */
  deadline: string;
  status: ReferralPostStatus;
  /** IDs of the students the alumni pointed the company towards. */
  suggestedStudentIds: number[];
  /** ISO date string of when the post was submitted. */
  createdAt: string;
}

/**
 * The raw values the create-post form holds while the user is typing.
 * `requiredSkills` is a single comma-separated string here and is split into an
 * array only when the post is actually created.
 */
export interface NewReferralPostForm {
  title: string;
  companyName: string;
  location: string;
  description: string;
  requiredSkills: string;
  vacancies: number;
  deadline: string;
  suggestedStudentIds: number[];
}
