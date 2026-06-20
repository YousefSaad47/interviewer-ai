-- AlterTable
ALTER TABLE "coding_submissions" ADD COLUMN     "ast_hash" TEXT;

-- CreateIndex
CREATE INDEX "coding_submissions_problem_id_language_ast_hash_idx" ON "coding_submissions"("problem_id", "language", "ast_hash");
