/*
  Warnings:

  - Made the column `translate` on table `Phrase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Phrase" ADD COLUMN     "reTranslate" VARCHAR(1500) NOT NULL DEFAULT '',
ALTER COLUMN "translate" SET NOT NULL,
ALTER COLUMN "translate" SET DEFAULT '';
