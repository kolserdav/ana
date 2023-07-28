/*
  Warnings:

  - The primary key for the `PushNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "PushNotificationUser" DROP CONSTRAINT "PushNotificationUser_pushNotificationId_fkey";

-- AlterTable
ALTER TABLE "PushNotification" DROP CONSTRAINT "PushNotification_pkey",
ADD COLUMN     "weight" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PushNotification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PushNotification_id_seq";

-- AlterTable
ALTER TABLE "PushNotificationUser" ALTER COLUMN "pushNotificationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "PushNotificationUser" ADD CONSTRAINT "PushNotificationUser_pushNotificationId_fkey" FOREIGN KEY ("pushNotificationId") REFERENCES "PushNotification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
