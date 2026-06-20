/*
  Warnings:

  - A unique constraint covering the columns `[hume_chat_id]` on the table `interviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "current_question" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hume_chat_group_id" TEXT,
ADD COLUMN     "hume_chat_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "interviews_hume_chat_id_key" ON "interviews"("hume_chat_id");
