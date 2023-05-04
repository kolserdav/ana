/*
  Warnings:

  - You are about to drop the `ServerMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ServerMessages";

-- CreateTable
CREATE TABLE "ServerMessage" (
    "id" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "text" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMessage_pkey" PRIMARY KEY ("id")
);
