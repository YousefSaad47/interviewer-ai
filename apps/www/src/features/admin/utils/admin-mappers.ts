import type {
  AdminAccount,
  AdminCodingSubmission,
  AdminCodingSubmissionDetailsView,
  AdminInterview,
  AdminInterviewDetailsView,
  AdminResume,
  AdminResumeDetailsView,
  AdminUser,
  AdminUserDetailsView,
} from "../types";
import type {
  AdminAccountListItemDto,
  AdminCodingSubmissionDetailsDto,
  AdminCodingSubmissionListItemDto,
  AdminInterviewDetailsDto,
  AdminInterviewListItemDto,
  AdminResumeDetailsDto,
  AdminResumeListItemDto,
  AdminUserDetailsDto,
  AdminUserListItemDto,
} from "../types/admin-api.types";
import {
  formatAdminDate,
  formatAdminDateTime,
  formatDuration,
  formatEnumLabel,
  formatNullableScore,
} from "./admin-formatters";

export const mapAdminUserListItem = (
  user: AdminUserListItemDto,
): AdminUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  emailVerified: user.emailVerified,
  role: user.role,
  date: formatAdminDate(user.createdAt),
  createdAt: user.createdAt,
  interviews: user.activity.interviews,
  coding: user.activity.codingSessions,
  resumes: user.activity.resumes,
  status: mapUserStatus(user.status),
  rawStatus: user.status,
  plan: formatEnumLabel(user.role),
});

export const mapAdminUserDetails = (
  user: AdminUserDetailsDto,
): AdminUserDetailsView => ({
  ...mapAdminUserListItem(user),
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt,
  lastLoginLabel: user.lastLoginAt
    ? formatAdminDateTime(user.lastLoginAt)
    : "No active session",
  recentActivity: user.recentActivity.map((activity) => ({
    id: activity.id,
    title: activity.title,
    status: activity.status,
    type: formatEnumLabel(activity.type),
    createdAt: activity.createdAt,
    createdAtLabel: formatAdminDateTime(activity.createdAt),
  })),
});

export const mapAdminInterviewListItem = (
  interview: AdminInterviewListItemDto,
): AdminInterview => ({
  id: interview.id,
  type: formatEnumLabel(interview.category),
  category: interview.category,
  difficulty: interview.difficulty,
  candidate: interview.candidate.name,
  candidateEmail: interview.candidate.email,
  candidateImage: interview.candidate.image,
  candidateId: interview.candidate.id,
  date: formatAdminDate(interview.startedAt),
  startedAt: interview.startedAt,
  completedAt: interview.completedAt,
  duration: formatDuration(interview.durationSeconds),
  questionCount: interview.questionCount,
  answeredQuestionCount: interview.answeredQuestionCount,
  currentQuestion: interview.currentQuestion,
  score: formatNullableScore(interview.overallScore),
  status: mapInterviewStatus(interview.status),
  rawStatus: interview.status,
});

export const mapAdminInterviewDetails = (
  interview: AdminInterviewDetailsDto,
): AdminInterviewDetailsView => ({
  ...mapAdminInterviewListItem({
    ...interview,
    answeredQuestionCount: interview.questions.reduce(
      (count, question) => count + question.answers.length,
      0,
    ),
  }),
  scores: {
    communication: formatNullableScore(interview.scores.communication),
    technical: formatNullableScore(interview.scores.technical),
    confidence: formatNullableScore(interview.scores.confidence),
  },
  questions: interview.questions.map((item) => ({
    id: item.id,
    sortOrder: item.sortOrder,
    followUpText: item.followUpText,
    text: item.question.text,
    category: formatEnumLabel(item.question.category),
    difficulty: formatEnumLabel(item.question.difficulty),
    answers: item.answers.map((answer) => ({
      id: answer.id,
      transcript: answer.transcript,
      durationMs: answer.durationMs,
      createdAt: answer.createdAt,
      createdAtLabel: formatAdminDateTime(answer.createdAt),
      feedback: answer.feedback.map((feedback) => ({
        id: feedback.id,
        overallScore: formatNullableScore(feedback.overallScore),
        idealAnswer: feedback.idealAnswer,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        fillerWordCount: feedback.fillerWordCount,
        fluencyScore: formatNullableScore(feedback.fluencyScore),
        clarityScore: formatNullableScore(feedback.clarityScore),
        confidenceScore: formatNullableScore(feedback.confidenceScore),
        relevanceScore: formatNullableScore(feedback.relevanceScore),
        technicalAccuracy: formatNullableScore(feedback.technicalAccuracy),
        detailLevel: feedback.detailLevel,
        sentimentScore: formatNullableScore(feedback.sentimentScore),
      })),
    })),
  })),
});

const mapUserStatus = (status: AdminUserListItemDto["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "DISABLED":
      return "Disabled";
  }
};

const mapInterviewStatus = (status: AdminInterviewListItemDto["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "Reviewed";
    case "IN_PROGRESS":
      return "Processing";
    case "ABANDONED":
      return "Flagged";
  }
};

export const mapAdminCodingSubmissionListItem = (
  submission: AdminCodingSubmissionListItemDto,
): AdminCodingSubmission => ({
  id: submission.id,
  candidate: submission.user.name,
  candidateEmail: submission.user.email,
  candidateImage: submission.user.image,
  candidateId: submission.user.id,
  problem: submission.problem.title,
  problemId: submission.problem.id,
  difficulty: formatEnumLabel(submission.problem.difficulty),
  language: submission.language,
  status: mapCodingStatus(submission.status),
  rawStatus: submission.status,
  score: formatNullableScore(submission.score),
  executionTimeMs: submission.executionTimeMs,
  memoryUsedKb: submission.memoryUsedKb,
  date: formatAdminDate(submission.createdAt),
  createdAt: submission.createdAt,
});

export const mapAdminCodingSubmissionDetails = (
  submission: AdminCodingSubmissionDetailsDto,
): AdminCodingSubmissionDetailsView => ({
  ...mapAdminCodingSubmissionListItem(submission),
  problemDescription: submission.problem.description,
  problemConstraints: submission.problem.constraints,
  code: submission.code,
  scores: {
    logic: formatNullableScore(submission.scores.logic),
    naming: formatNullableScore(submission.scores.naming),
    efficiency: formatNullableScore(submission.scores.efficiency),
    bestPractices: formatNullableScore(submission.scores.bestPractices),
  },
  aiFeedback: submission.aiFeedback,
  results: submission.results.map((result) => ({
    id: result.id,
    passed: result.passed,
    output: result.output,
    error: result.error,
    testCase: {
      id: result.testCase.id,
      isHidden: result.testCase.isHidden,
      sortOrder: result.testCase.sortOrder,
      input: result.testCase.input,
      output: result.testCase.output,
    },
  })),
});

const mapCodingStatus = (
  status: AdminCodingSubmissionListItemDto["status"],
) => {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "WRONG_ANSWER":
      return "Wrong Answer";
    case "RUNTIME_ERROR":
      return "Runtime Error";
    case "COMPILE_ERROR":
      return "Compile Error";
    case "TIME_LIMIT_EXCEEDED":
      return "Time Limit";
    case "MEMORY_LIMIT_EXCEEDED":
      return "Memory Limit";
    case "PARTIAL":
      return "Partial";
    case "PENDING":
      return "Pending";
  }
};

export const mapAdminResumeListItem = (
  resume: AdminResumeListItemDto,
): AdminResume => ({
  id: resume.id,
  candidate: resume.candidate.name,
  candidateEmail: resume.candidate.email,
  candidateImage: resume.candidate.image,
  candidateId: resume.candidate.id,
  title: resume.title,
  score: formatNullableScore(resume.atsScore),
  grammarScore: formatNullableScore(resume.grammarScore),
  suggestionsCount: resume.suggestionsCount,
  matchesCount: resume.matchesCount,
  date: formatAdminDate(resume.createdAt),
  createdAt: resume.createdAt,
  updatedAt: resume.updatedAt,
  status: mapResumeStatus(resume.status),
  rawStatus: resume.status,
  role: resume.title,
});

export const mapAdminResumeDetails = (
  resume: AdminResumeDetailsDto,
): AdminResumeDetailsView => ({
  ...mapAdminResumeListItem({
    ...resume,
    suggestionsCount: resume.suggestions.length,
    matchesCount: resume.matches.length,
  }),
  suggestions: resume.suggestions,
  contentPreview: resume.contentPreview,
  matches: resume.matches,
});

export const mapAdminAccountListItem = (
  admin: AdminAccountListItemDto,
): AdminAccount => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  image: admin.image,
  emailVerified: admin.emailVerified,
  role: formatEnumLabel(admin.role),
  rawRole: admin.role,
  status: mapAdminAccountStatus(admin.status),
  rawStatus: admin.status,
  lastLogin: admin.lastLoginAt
    ? formatAdminDateTime(admin.lastLoginAt)
    : "No active session",
  lastLoginAt: admin.lastLoginAt,
  createdAt: admin.createdAt,
});

const mapResumeStatus = (status: AdminResumeListItemDto["status"]) => {
  switch (status) {
    case "COMPLETE":
      return "Complete";
    case "DRAFT":
      return "Draft";
    case "ARCHIVED":
      return "Archived";
  }
};

const mapAdminAccountStatus = (status: AdminAccountListItemDto["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "DISABLED":
      return "Disabled";
  }
};
