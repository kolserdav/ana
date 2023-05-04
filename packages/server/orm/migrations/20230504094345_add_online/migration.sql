-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('info', 'warn', 'error');

-- CreateTable
CREATE TABLE "ServerMessages" (
    "id" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "text" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Online" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Online_pkey" PRIMARY KEY ("id")
);
