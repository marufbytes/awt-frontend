// src/lib/alumni/mockData.ts
import type {
  ReferralPost,
  StudentApplication,
  UnplacedStudent,
} from '@/lib/alumni/types';

/** The alumni who is "logged in" for now. */
export const MOCK_CURRENT_ALUMNI = {
  id: 1,
  name: 'Anik Ruhan',
  initials: 'AR',
  jobTitle: 'Software Engineer',
  companyName: 'Akij IT',
  graduationYear: 2020,
};

export const MOCK_UNPLACED_STUDENTS: UnplacedStudent[] = [
  {
    id: 101,
    firstName: 'Ayesha',
    lastName: 'Rahman',
    email: 'ayesha.rahman@student.edu',
    department: 'Computer Science',
    graduationYear: 2026,
    cgpa: 3.78,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    applicationCount: 4,
    resumeUrl: 'https://example.com/resume/ayesha-rahman.pdf',
  },
  {
    id: 102,
    firstName: 'Tanvir',
    lastName: 'Hasan',
    email: 'tanvir.hasan@student.edu',
    department: 'Software Engineering',
    graduationYear: 2026,
    cgpa: 3.55,
    skills: ['Java', 'Spring Boot', 'MySQL'],
    applicationCount: 2,
    resumeUrl: 'https://example.com/resume/tanvir-hasan.pdf',
  },
  {
    id: 103,
    firstName: 'Nusrat',
    lastName: 'Jahan',
    email: 'nusrat.jahan@student.edu',
    department: 'Computer Science',
    graduationYear: 2025,
    cgpa: 3.91,
    skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow'],
    applicationCount: 6,
    resumeUrl: 'https://example.com/resume/nusrat-jahan.pdf',
  },
  {
    id: 104,
    firstName: 'Rafiul',
    lastName: 'Islam',
    email: 'rafiul.islam@student.edu',
    department: 'Electrical Engineering',
    graduationYear: 2026,
    cgpa: 3.40,
    skills: ['C', 'Embedded Systems', 'MATLAB'],
    applicationCount: 1,
    resumeUrl: null,
  },
  {
    id: 105,
    firstName: 'Sadia',
    lastName: 'Akter',
    email: 'sadia.akter@student.edu',
    department: 'Software Engineering',
    graduationYear: 2025,
    cgpa: 3.67,
    skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    applicationCount: 3,
    resumeUrl: 'https://example.com/resume/sadia-akter.pdf',
  },
  {
    id: 106,
    firstName: 'Mahin',
    lastName: 'Chowdhury',
    email: 'mahin.chowdhury@student.edu',
    department: 'Computer Science',
    graduationYear: 2026,
    cgpa: 3.22,
    skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
    applicationCount: 0,
    resumeUrl: null,
  },
];

export const MOCK_REFERRAL_POSTS: ReferralPost[] = [
  {
    id: 1,
    title: 'Junior Frontend Intern',
    companyName: 'Akij IT',
    location: 'Banani, Dhaka',
    description:
      'Work with our product team on customer-facing dashboards built in React and TypeScript. You will pair with senior engineers and ship small features from week one.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    vacancies: 2,
    deadline: '2026-10-15',
    status: 'APPROVED',
    suggestedStudentIds: [101, 106],
    createdAt: '2026-09-01',
  },
  {
    id: 2,
    title: 'Backend Intern (Node.js)',
    companyName: 'Akij IT',
    location: 'Remote',
    description:
      'Help build and maintain internal REST APIs. Good opportunity to learn about databases, testing, and deployment pipelines in a real production environment.',
    requiredSkills: ['Node.js', 'PostgreSQL', 'REST APIs'],
    vacancies: 1,
    deadline: '2026-09-30',
    status: 'PENDING',
    suggestedStudentIds: [102],
    createdAt: '2026-09-06',
  },
  {
    id: 3,
    title: 'Data Analyst Intern',
    companyName: 'Akij IT',
    location: 'Mohakhali, Dhaka',
    description:
      'Support the analytics team with reporting and simple predictive models. Great fit for a student who enjoys Python and statistics.',
    requiredSkills: ['Python', 'Pandas', 'SQL'],
    vacancies: 1,
    deadline: '2026-08-20',
    status: 'REJECTED',
    suggestedStudentIds: [103],
    createdAt: '2026-08-05',
  },
];

/**
 * Students who applied through one of the alumni's APPROVED circulars. Students
 * can only apply once admin approves a post, so these all point at post id 1
 * ("Junior Frontend Intern"), the only APPROVED post above.
 */
export const MOCK_STUDENT_APPLICATIONS: StudentApplication[] = [
  {
    id: 1001,
    studentId: 103,
    referralPostId: 1,
    status: 'ACCEPTED',
    appliedAt: '2026-09-05',
    responseMessage: "You're in! We'll email you the next steps shortly.",
  },
  {
    id: 1002,
    studentId: 102,
    referralPostId: 1,
    status: 'REJECTED',
    appliedAt: '2026-09-03',
    responseMessage:
      "Thanks for applying — we've decided to move forward with other candidates this round.",
  },
  {
    id: 1003,
    studentId: 101,
    referralPostId: 1,
    status: 'PENDING',
    appliedAt: '2026-09-08',
    responseMessage: null,
  },
  {
    id: 1004,
    studentId: 105,
    referralPostId: 1,
    status: 'PENDING',
    appliedAt: '2026-09-09',
    responseMessage: null,
  },
  {
    id: 1005,
    studentId: 106,
    referralPostId: 1,
    status: 'PENDING',
    appliedAt: '2026-09-10',
    responseMessage: null,
  },
  {
    id: 1006,
    studentId: 104,
    referralPostId: 1,
    status: 'PENDING',
    appliedAt: '2026-09-11',
    responseMessage: null,
  },
];
