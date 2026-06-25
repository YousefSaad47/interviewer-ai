import type {
  AdminInterview,
  AdminInterviewDetailsView,
  AdminUser,
  AdminUserDetailsView,
} from "../types";
import type {
  AdminInterviewDetailsDto,
  AdminInterviewListItemDto,
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
