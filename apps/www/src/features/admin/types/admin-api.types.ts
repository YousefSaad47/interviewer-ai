export type AdminUserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type AdminUserStatus = "ACTIVE" | "DISABLED";

export type AdminPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminUsersQuery = {
  search?: string;
  status?: AdminUserStatus;
  role?: AdminUserRole;
  page?: number;
  limit?: number;
};

export type AdminUserActivityCounts = {
  interviews: number;
  codingSessions: number;
  resumes: number;
};

export type AdminUserListItemDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  activity: AdminUserActivityCounts;
};

export type AdminUserRecentActivityDto = {
  id: string;
  type: "INTERVIEW" | "CODING_SUBMISSION" | "RESUME";
  title: string;
  status: string;
  createdAt: string;
};

export type AdminUserDetailsDto = AdminUserListItemDto & {
  updatedAt: string;
  lastLoginAt: string | null;
  recentActivity: AdminUserRecentActivityDto[];
};

export type AdminUsersListResponse = {
  data: AdminUserListItemDto[];
  pagination: AdminPagination;
};

export type AdminUserStatusBody = {
  status: AdminUserStatus;
};

export type AdminUserStatusResponse = {
  id: string;
  status: AdminUserStatus;
};

export type AdminInterviewStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type AdminInterviewDifficulty = "EASY" | "MEDIUM" | "HARD";

export type AdminInterviewCategory =
  | "DATA_STRUCTURES"
  | "ALGORITHMS"
  | "SYSTEM_DESIGN"
  | "BEHAVIORAL"
  | "HR"
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "DATABASE"
  | "DEVOPS"
  | "MACHINE_LEARNING";

export type AdminInterviewsQuery = {
  search?: string;
  userId?: string;
  status?: AdminInterviewStatus;
  category?: AdminInterviewCategory;
  difficulty?: AdminInterviewDifficulty;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type AdminInterviewCandidateDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type AdminInterviewListItemDto = {
  id: string;
  candidate: AdminInterviewCandidateDto;
  category: AdminInterviewCategory;
  difficulty: AdminInterviewDifficulty;
  status: AdminInterviewStatus;
  questionCount: number;
  answeredQuestionCount: number;
  currentQuestion: number;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  overallScore: number | null;
};

export type AdminInterviewsListResponse = {
  data: AdminInterviewListItemDto[];
  pagination: AdminPagination;
};

export type AdminInterviewScoresDto = {
  communication: number | null;
  technical: number | null;
  confidence: number | null;
};

export type AdminAnswerFeedbackDetailsDto = {
  id: string;
  overallScore: number | null;
  idealAnswer: string | null;
  strengths: string[];
  improvements: string[];
  fillerWordCount: number | null;
  fluencyScore: number | null;
  clarityScore: number | null;
  confidenceScore: number | null;
  relevanceScore: number | null;
  technicalAccuracy: number | null;
  detailLevel: string | null;
  sentimentScore: number | null;
};

export type AdminInterviewAnswerDetailsDto = {
  id: string;
  transcript: string | null;
  durationMs: number | null;
  createdAt: string;
  feedback: AdminAnswerFeedbackDetailsDto[];
};

export type AdminInterviewQuestionDetailsDto = {
  id: string;
  sortOrder: number;
  question: {
    id: string;
    text: string;
    category: AdminInterviewCategory;
    difficulty: AdminInterviewDifficulty;
  };
  followUpText: string | null;
  answers: AdminInterviewAnswerDetailsDto[];
};

export type AdminInterviewDetailsDto = Omit<
  AdminInterviewListItemDto,
  "answeredQuestionCount"
> & {
  scores: AdminInterviewScoresDto;
  questions: AdminInterviewQuestionDetailsDto[];
};
