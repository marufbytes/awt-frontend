export interface UnplacedStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  applicationCount: number;
  resumeUrl: string | null;
}

export type ReferralPostStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface ReferralPost {
  id: number;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requiredSkills: string[];
  vacancies: number;
  deadline: string;
  status: ReferralPostStatus;
  suggestedStudentIds: number[];
  createdAt: string;
}

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

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface StudentApplication {
  id: number;
  studentId: number;
  referralPostId: number;
  status: ApplicationStatus;
  appliedAt: string;
  responseMessage?: string | null;
}

export interface StudentApplicationView extends StudentApplication {
  student: UnplacedStudent;
  post: ReferralPost;
}
