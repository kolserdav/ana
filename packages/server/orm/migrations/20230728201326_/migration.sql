/*
  Warnings:

  - You are about to drop the column `weight` on the `PushNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PushNotification" DROP COLUMN "weight",
ADD COLUMN     "priority" SERIAL NOT NULL;
