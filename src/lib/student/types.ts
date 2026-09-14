
export type UserRole = "STUDENT" | "ALUMNI" | "HR" | "ADMIN";

export interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePictureUrl: string | null;
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  description?: string | null;
  isVerified?: boolean;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  company: Company;
  createdAt?: string;
}

export interface Resume {
  id: number;
  title: string;
  fileUrl: string;
  skills: string[] | null;
  createDate: string;
  updateDate?: string;
}

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export type ApplicationType = "direct" | "referral";

export interface Application {
  id: number;
  status: ApplicationStatus;
  type: ApplicationType;
  createdAt: string;
  updatedAt: string;
  internship: Internship;
  resume: Resume;
  referredBy: { id: number; firstName: string; lastName: string } | null;
}

export interface Interview {
  id: number;
  applicationId: number;
  scheduledDate: string;
  meetingLink: string;
  status: string;
  application: {
    id: number;
    status: ApplicationStatus;
    internship: Internship;
  };
}
