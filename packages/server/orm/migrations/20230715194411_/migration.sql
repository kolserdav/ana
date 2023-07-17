-- CreateTable
CREATE TABLE "PushNotification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushNotificationUser" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pushNotificationId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushNotificationUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PushNotificationUser" ADD CONSTRAINT "PushNotificationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushNotificationUser" ADD CONSTRAINT "PushNotificationUser_pushNotificationId_fkey" FOREIGN KEY ("pushNotificationId") REFERENCES "PushNotification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
