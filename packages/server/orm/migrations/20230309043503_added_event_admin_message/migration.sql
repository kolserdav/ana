-- AlterEnum
ALTER TYPE "EventName" ADD VALUE 'adminMessage';

-- AlterTable
ALTER TABLE "ProjectEvent" ADD COLUMN     "content" TEXT;
