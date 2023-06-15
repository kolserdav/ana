-- CreateTable
CREATE TABLE "OnlineStatistic" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnlineStatistic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OnlineStatistic" ADD CONSTRAINT "OnlineStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
