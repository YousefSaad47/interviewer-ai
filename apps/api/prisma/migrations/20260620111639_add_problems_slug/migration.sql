/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `coding_problems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `coding_problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coding_problems" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "coding_problems_slug_key" ON "coding_problems"("slug");
