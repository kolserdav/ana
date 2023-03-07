-- DropForeignKey
ALTER TABLE "ProjectMessage" DROP CONSTRAINT "ProjectMessage_fileId_fkey";

-- AlterTable
ALTER TABLE "ProjectMessage" ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectMessage" ADD CONSTRAINT "ProjectMessage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
