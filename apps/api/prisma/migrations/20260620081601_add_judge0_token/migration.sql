/*
  Warnings:

  - A unique constraint covering the columns `[judge0_token]` on the table `coding_submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "coding_submissions" ADD COLUMN     "judge0_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "coding_submissions_judge0_token_key" ON "coding_submissions"("judge0_token");
