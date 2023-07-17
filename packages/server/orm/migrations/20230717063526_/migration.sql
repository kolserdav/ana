/*
  Warnings:

  - You are about to alter the column `title` on the `PushNotification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(48)`.
  - You are about to alter the column `description` on the `PushNotification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(140)`.

*/
-- AlterTable
ALTER TABLE "PushNotification" ALTER COLUMN "title" SET DATA TYPE VARCHAR(48),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(140);
