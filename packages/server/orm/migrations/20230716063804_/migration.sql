/*
  Warnings:

  - Added the required column `lang` to the `PushNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PushNotification" ADD COLUMN     "lang" "Lang" NOT NULL;
