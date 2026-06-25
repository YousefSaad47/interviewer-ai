/** biome-ignore-all lint/complexity/noStaticOnlyClass: mapper namespace follows the module's OOP style */

import type {
  AdminInterviewDetailsRecord,
  AdminInterviewListRecord,
} from "./admin-interviews.repository";
import type {
  AdminInterviewDetails,
  AdminInterviewListItem,
} from "./admin-interviews.schema";
import {
  calculateDurationSeconds,
  calculateOverallScore,
  calculateScoreBreakdown,
} from "./admin-interviews.scoring";

export class AdminInterviewsMapper {
  public static toListItem(
    interview: AdminInterviewListRecord,
  ): AdminInterviewListItem {
    return {
      id: interview.id,
      candidate: {
        id: interview.user.id,
        name: interview.user.name,
        email: interview.user.email,
        image: interview.user.image,
      },
      category: interview.category,
      difficulty: interview.difficulty,
      status: interview.status,
      questionCount: interview.questionCount,
      answeredQuestionCount: interview._count.answers,
      currentQuestion: interview.currentQuestion,
      startedAt: interview.startedAt.toISOString(),
      completedAt: interview.completedAt?.toISOString() ?? null,
      durationSeconds: calculateDurationSeconds(
        interview.startedAt,
        interview.completedAt,
      ),
      overallScore: calculateOverallScore(
        interview.answers.flatMap((answer) => answer.feedback),
      ),
    };
  }

  public static toDetails(
    interview: AdminInterviewDetailsRecord,
  ): AdminInterviewDetails {
    const feedback = interview.questions.flatMap((interviewQuestion) =>
      interviewQuestion.answers.flatMap((answer) => answer.feedback),
    );

    return {
      id: interview.id,
      candidate: {
        id: interview.user.id,
        name: interview.user.name,
        email: interview.user.email,
        image: interview.user.image,
      },
      category: interview.category,
      difficulty: interview.difficulty,
      status: interview.status,
      questionCount: interview.questionCount,
      currentQuestion: interview.currentQuestion,
      startedAt: interview.startedAt.toISOString(),
      completedAt: interview.completedAt?.toISOString() ?? null,
      durationSeconds: calculateDurationSeconds(
        interview.startedAt,
        interview.completedAt,
      ),
      overallScore: calculateOverallScore(feedback),
      scores: calculateScoreBreakdown(feedback),
      questions: interview.questions.map((interviewQuestion) => ({
        id: interviewQuestion.id,
        sortOrder: interviewQuestion.sortOrder,
        followUpText: interviewQuestion.followUpText,
        question: {
          id: interviewQuestion.question.id,
          text: interviewQuestion.question.text,
          category: interviewQuestion.question.category,
          difficulty: interviewQuestion.question.difficulty,
        },
        answers: interviewQuestion.answers.map((answer) => ({
          id: answer.id,
          transcript: answer.transcript,
          durationMs: answer.durationMs,
          createdAt: answer.createdAt.toISOString(),
          feedback: answer.feedback.map((item) => ({
            id: item.id,
            overallScore: item.overallScore,
            idealAnswer: item.idealAnswer,
            strengths: item.strengths,
            improvements: item.improvements,
            fillerWordCount: item.fillerWordCount,
            fluencyScore: item.fluencyScore,
            clarityScore: item.clarityScore,
            confidenceScore: item.confidenceScore,
            relevanceScore: item.relevanceScore,
            technicalAccuracy: item.technicalAccuracy,
            detailLevel: item.detailLevel,
            sentimentScore: item.sentimentScore,
          })),
        })),
      })),
    };
  }
}
