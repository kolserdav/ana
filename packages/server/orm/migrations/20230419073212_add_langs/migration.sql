/*
  Warnings:

  - Added the required column `learnLang` to the `Phrase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nativeLang` to the `Phrase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Phrase" ADD COLUMN     "learnLang" VARCHAR(2) NOT NULL,
ADD COLUMN     "nativeLang" VARCHAR(2) NOT NULL;
