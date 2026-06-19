/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `sessions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InterviewCategory" AS ENUM ('DATA_STRUCTURES', 'ALGORITHMS', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'HR', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'DATABASE', 'DEVOPS', 'MACHINE_LEARNING');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('DRAFT', 'COMPLETE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProblemDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR');

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "user_agent" TEXT;

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL,
    "category" "InterviewCategory" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "question_count" INTEGER NOT NULL DEFAULT 5,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "category" "InterviewCategory" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "text" TEXT NOT NULL,
    "suggested_answer" TEXT,
    "is_coding" BOOLEAN NOT NULL DEFAULT false,
    "coding_problem_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "interview_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "follow_up_text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "transcript" TEXT,
    "audio_url" TEXT,
    "duration_ms" INTEGER,
    "interview_question_id" UUID NOT NULL,
    "interview_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_feedback" (
    "id" UUID NOT NULL,
    "ideal_answer" TEXT,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "overall_score" DOUBLE PRECISION,
    "filler_word_count" INTEGER,
    "fluency_score" DOUBLE PRECISION,
    "clarity_score" DOUBLE PRECISION,
    "confidence_score" DOUBLE PRECISION,
    "emotional_tone" JSONB,
    "sentiment_score" DOUBLE PRECISION,
    "detail_level" TEXT,
    "relevance_score" DOUBLE PRECISION,
    "technical_accuracy" DOUBLE PRECISION,
    "answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "answer_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_snapshots" (
    "id" UUID NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "category" "InterviewCategory" NOT NULL,
    "avgConfidence" DOUBLE PRECISION,
    "avgFluency" DOUBLE PRECISION,
    "avgClarity" DOUBLE PRECISION,
    "avgScore" DOUBLE PRECISION,
    "total_answered" INTEGER,
    "time_spent_sec" INTEGER,
    "recommendation" TEXT,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "performance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ResumeStatus" NOT NULL DEFAULT 'DRAFT',
    "content" JSONB NOT NULL,
    "ats_score" DOUBLE PRECISION,
    "grammar_score" DOUBLE PRECISION,
    "suggestions" TEXT[],
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_descriptions" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "raw_text" TEXT NOT NULL,
    "keywords" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_matches" (
    "id" UUID NOT NULL,
    "match_pct" DOUBLE PRECISION NOT NULL,
    "matched_keywords" TEXT[],
    "missing_keywords" TEXT[],
    "tailored_resume" JSONB,
    "resume_id" UUID NOT NULL,
    "job_description_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "resume_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_problems" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "ProblemDifficulty" NOT NULL DEFAULT 'EASY',
    "description" TEXT NOT NULL,
    "constraints" TEXT,
    "examples" JSONB NOT NULL,
    "starter_code" JSONB,
    "time_limit_ms" INTEGER NOT NULL DEFAULT 2000,
    "memory_limit_kb" INTEGER NOT NULL DEFAULT 256000,
    "logic_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "naming_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "efficiency_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "best_practices_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "coding_problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "id" UUID NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "problem_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_submissions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'javascript',
    "status" "SubmissionStatus" NOT NULL,
    "logic_score" DOUBLE PRECISION,
    "naming_score" DOUBLE PRECISION,
    "efficiency_score" DOUBLE PRECISION,
    "best_practices_score" DOUBLE PRECISION,
    "ai_feedback" TEXT,
    "execution_time_ms" INTEGER,
    "memory_used_kb" INTEGER,
    "problem_id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "coding_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_submission_results" (
    "id" UUID NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "output" TEXT,
    "error" TEXT,
    "submission_id" UUID NOT NULL,
    "test_case_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "coding_submission_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interviews_userId_created_at_idx" ON "interviews"("userId", "created_at");

-- CreateIndex
CREATE INDEX "interviews_userId_status_idx" ON "interviews"("userId", "status");

-- CreateIndex
CREATE INDEX "questions_category_difficulty_idx" ON "questions"("category", "difficulty");

-- CreateIndex
CREATE INDEX "interview_questions_interview_id_idx" ON "interview_questions"("interview_id");

-- CreateIndex
CREATE INDEX "interview_questions_question_id_idx" ON "interview_questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_questions_interview_id_question_id_key" ON "interview_questions"("interview_id", "question_id");

-- CreateIndex
CREATE INDEX "answers_interview_question_id_idx" ON "answers"("interview_question_id");

-- CreateIndex
CREATE INDEX "answers_interview_id_idx" ON "answers"("interview_id");

-- CreateIndex
CREATE INDEX "answer_feedback_answer_id_idx" ON "answer_feedback"("answer_id");

-- CreateIndex
CREATE INDEX "performance_snapshots_userId_snapshot_date_idx" ON "performance_snapshots"("userId", "snapshot_date");

-- CreateIndex
CREATE UNIQUE INDEX "performance_snapshots_userId_snapshot_date_category_key" ON "performance_snapshots"("userId", "snapshot_date", "category");

-- CreateIndex
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");

-- CreateIndex
CREATE INDEX "resumes_userId_status_idx" ON "resumes"("userId", "status");

-- CreateIndex
CREATE INDEX "job_descriptions_title_idx" ON "job_descriptions"("title");

-- CreateIndex
CREATE INDEX "resume_matches_resume_id_idx" ON "resume_matches"("resume_id");

-- CreateIndex
CREATE INDEX "resume_matches_job_description_id_idx" ON "resume_matches"("job_description_id");

-- CreateIndex
CREATE UNIQUE INDEX "resume_matches_resume_id_job_description_id_key" ON "resume_matches"("resume_id", "job_description_id");

-- CreateIndex
CREATE INDEX "coding_problems_difficulty_idx" ON "coding_problems"("difficulty");

-- CreateIndex
CREATE INDEX "test_cases_problem_id_idx" ON "test_cases"("problem_id");

-- CreateIndex
CREATE INDEX "coding_submissions_userId_problem_id_idx" ON "coding_submissions"("userId", "problem_id");

-- CreateIndex
CREATE INDEX "coding_submissions_problem_id_idx" ON "coding_submissions"("problem_id");

-- CreateIndex
CREATE INDEX "coding_submissions_status_idx" ON "coding_submissions"("status");

-- CreateIndex
CREATE INDEX "coding_submission_results_submission_id_idx" ON "coding_submission_results"("submission_id");

-- CreateIndex
CREATE INDEX "coding_submission_results_test_case_id_idx" ON "coding_submission_results"("test_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "coding_submission_results_submission_id_test_case_id_key" ON "coding_submission_results"("submission_id", "test_case_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_interview_question_id_fkey" FOREIGN KEY ("interview_question_id") REFERENCES "interview_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_feedback" ADD CONSTRAINT "answer_feedback_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_snapshots" ADD CONSTRAINT "performance_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_matches" ADD CONSTRAINT "resume_matches_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_matches" ADD CONSTRAINT "resume_matches_job_description_id_fkey" FOREIGN KEY ("job_description_id") REFERENCES "job_descriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submission_results" ADD CONSTRAINT "coding_submission_results_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "coding_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submission_results" ADD CONSTRAINT "coding_submission_results_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
