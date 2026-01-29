/*
  Warnings:

  - You are about to drop the column `contentFormat` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "contentFormat";

-- DropEnum
DROP TYPE "ContentFormat";

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_boardId_idx" ON "Post"("boardId");

-- CreateIndex
CREATE INDEX "Rate_createdAt_idx" ON "Rate"("createdAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
