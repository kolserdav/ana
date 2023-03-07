-- CreateEnum
CREATE TYPE "EventName" AS ENUM ('giveSide', 'acceptSide', 'startProject', 'stopProject', 'openDispute');

-- CreateTable
CREATE TABLE "ProjectEvent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sideId" TEXT NOT NULL,
    "event" "EventName" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectEvent" ADD CONSTRAINT "ProjectEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvent" ADD CONSTRAINT "ProjectEvent_sideId_fkey" FOREIGN KEY ("sideId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
