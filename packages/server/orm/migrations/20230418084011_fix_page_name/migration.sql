/*
  Warnings:

  - The values [my] on the enum `PageField` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PageField_new" AS ENUM ('title', 'description', 'keywords', 'content');
ALTER TABLE "Page" ALTER COLUMN "field" TYPE "PageField_new" USING ("field"::text::"PageField_new");
ALTER TYPE "PageField" RENAME TO "PageField_old";
ALTER TYPE "PageField_new" RENAME TO "PageField";
DROP TYPE "PageField_old";
COMMIT;

-- AlterEnum
ALTER TYPE "PageName" ADD VALUE 'my';
