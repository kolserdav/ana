/*
  Warnings:

  - Added the required column `lang` to the `ServerMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServerMessage" ADD COLUMN     "lang" "Lang" NOT NULL;
