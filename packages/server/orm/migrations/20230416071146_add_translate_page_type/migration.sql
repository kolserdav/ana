/*
  Warnings:

  - The values [meEmployer,meEmployerCreateProject,meWorker,meWorkerCreateProject,meEmployerProjects,meWorkerProjects] on the enum `PageName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PageName_new" AS ENUM ('index', 'login', 'registration', 'restorePassword', 'changePassword', 'confirmEmail', 'translate');
ALTER TABLE "Page" ALTER COLUMN "name" TYPE "PageName_new" USING ("name"::text::"PageName_new");
ALTER TYPE "PageName" RENAME TO "PageName_old";
ALTER TYPE "PageName_new" RENAME TO "PageName";
DROP TYPE "PageName_old";
COMMIT;
