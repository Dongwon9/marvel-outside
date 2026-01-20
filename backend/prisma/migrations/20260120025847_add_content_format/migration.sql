-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('markdown', 'plaintext');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentFormat" "ContentFormat" NOT NULL DEFAULT 'markdown';
