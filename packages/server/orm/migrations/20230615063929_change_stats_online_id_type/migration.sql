/*
  Warnings:

  - The primary key for the `OnlineStatistic` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OnlineStatistic" DROP CONSTRAINT "OnlineStatistic_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OnlineStatistic_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OnlineStatistic_id_seq";
