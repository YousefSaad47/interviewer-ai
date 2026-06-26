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

// ─── Admin Coding Submissions ─────────────────────────────────────────────────

export type AdminCodingSubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "RUNTIME_ERROR"
  | "COMPILE_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "PARTIAL";

export type AdminCodingDifficulty = "EASY" | "MEDIUM" | "HARD";

export type AdminCodingSubmissionsQuery = {
  search?: string;
  userId?: string;
  problemId?: string;
  status?: AdminCodingSubmissionStatus;
  language?: string;
  difficulty?: AdminCodingDifficulty;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type AdminCodingUserDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type AdminCodingProblemListDto = {
  id: string;
  title: string;
  slug: string;
  difficulty: AdminCodingDifficulty;
};

export type AdminCodingProblemDetailsDto = AdminCodingProblemListDto & {
  description: string;
  constraints: string | null;
};

export type AdminCodingSubmissionListItemDto = {
  id: string;
  user: AdminCodingUserDto;
  problem: AdminCodingProblemListDto;
  language: string;
  status: AdminCodingSubmissionStatus;
  score: number | null;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  createdAt: string;
};

export type AdminCodingSubmissionsListResponse = {
  data: AdminCodingSubmissionListItemDto[];
  pagination: AdminPagination;
};

export type AdminCodingScoresDto = {
  logic: number | null;
  naming: number | null;
  efficiency: number | null;
  bestPractices: number | null;
};

export type AdminCodingSubmissionResultDto = {
  id: string;
  passed: boolean;
  output: string | null;
  error: string | null;
  testCase: {
    id: string;
    isHidden: boolean;
    sortOrder: number;
    input?: string;
    output?: string;
  };
};

export type AdminCodingSubmissionDetailsDto = Omit<
  AdminCodingSubmissionListItemDto,
  "problem"
> & {
  problem: AdminCodingProblemDetailsDto;
  code: string;
  scores: AdminCodingScoresDto;
  aiFeedback: string | null;
  results: AdminCodingSubmissionResultDto[];
};

export type AdminResumeStatus = "DRAFT" | "COMPLETE" | "ARCHIVED";

export type AdminResumesQuery = {
  search?: string;
  userId?: string;
  status?: AdminResumeStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type AdminResumeCandidateDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type AdminResumeListItemDto = {
  id: string;
  candidate: AdminResumeCandidateDto;
  title: string;
  status: AdminResumeStatus;
  atsScore: number | null;
  grammarScore: number | null;
  suggestionsCount: number;
  matchesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminResumesListResponse = {
  data: AdminResumeListItemDto[];
  pagination: AdminPagination;
};

export type AdminResumeContentPreviewDto = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  experienceCount?: number;
  educationCount?: number;
};

export type AdminResumeMatchDto = {
  id: string;
  matchPct: number;
  jobTitle: string;
  company: string;
  matchedKeywords: string[];
  missingKeywords: string[];
};

export type AdminResumeDetailsDto = Omit<
  AdminResumeListItemDto,
  "suggestionsCount" | "matchesCount"
> & {
  suggestions: string[];
  contentPreview: AdminResumeContentPreviewDto;
  matches: AdminResumeMatchDto[];
};

export type AdminAnalyticsRange = "7d" | "30d" | "90d";
export type AdminAnalyticsInterval = "day" | "week";

export type AdminAnalyticsQuery = {
  range?: AdminAnalyticsRange;
  interval?: AdminAnalyticsInterval;
};

export type AdminTimeSeriesPointDto = {
  date: string;
  count: number;
};

export type AdminFeatureUsageDto = {
  feature: "interviews" | "coding" | "resumes";
  count: number;
};

export type AdminAnalyticsResponse = {
  usersGrowth: AdminTimeSeriesPointDto[];
  interviewsActivity: AdminTimeSeriesPointDto[];
  codingActivity: AdminTimeSeriesPointDto[];
  resumeUsage: AdminTimeSeriesPointDto[];
  mostUsedFeatures: AdminFeatureUsageDto[];
  completionRates: {
    interviews: number;
    codingAccepted: number;
    resumesComplete: number;
  };
};

export type AdminAccountRole = "ADMIN" | "SUPER_ADMIN";
export type AdminAccountStatus = "ACTIVE" | "DISABLED";

export type AdminAccountsQuery = {
  search?: string;
  status?: AdminAccountStatus;
  role?: AdminAccountRole;
  page?: number;
  limit?: number;
};

export type AdminAccountListItemDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  createdAt: string;
  lastLoginAt: string | null;
};

export type AdminAccountsListResponse = {
  data: AdminAccountListItemDto[];
  pagination: AdminPagination;
};

export type PromoteAdminBody = {
  userId: string;
  role: AdminAccountRole;
};

export type UpdateAdminBody = {
  role?: AdminAccountRole;
  status?: AdminAccountStatus;
};

export type AdminAccountMutationResponse = {
  id: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
};

export type RemoveAdminAccessResponse = {
  success: true;
};
