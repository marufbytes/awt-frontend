
export interface Company {
  id: number;
  name: string;
  industry: string;
  description: string | null;
  isVerified: boolean;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  company: { id: number; name: string } | null;
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface ApplicationView {
  id: number;
  status: ApplicationStatus;
  type: 'direct' | 'referral';
  createdAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  internship: {
    id: number;
    title: string;
    company: { id: number; name: string } | null;
  };
  resume: { id: number; title: string; fileUrl: string } | null;
}

export interface Interview {
  id: number;
  scheduledDate: string;
  meetingLink: string;
  status: string;
  application: {
    id: number;
    status: string;
    student: { id: number; firstName: string; lastName: string; email: string };
    internship: {
      id: number;
      title: string;
      company: { id: number; name: string } | null;
    };
  };
}

export interface NewInternshipForm {
  title: string;
  description: string;
  requirements: string;
}

export interface NewCompanyForm {
  name: string;
  industry: string;
  description?: string;
}
