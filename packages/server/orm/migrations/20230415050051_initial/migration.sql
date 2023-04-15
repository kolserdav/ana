-- CreateEnum
CREATE TYPE "PageName" AS ENUM ('index', 'login', 'registration', 'restorePassword', 'changePassword', 'confirmEmail', 'meEmployer', 'meEmployerCreateProject', 'meWorker', 'meWorkerCreateProject', 'meEmployerProjects', 'meWorkerProjects');

-- CreateEnum
CREATE TYPE "PageField" AS ENUM ('title', 'description', 'keywords', 'content');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('ru');

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "name" "PageName" NOT NULL,
    "field" "PageField" NOT NULL,
    "value" VARCHAR(1000) NOT NULL,
    "lang" "Lang" NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(24),
    "email" VARCHAR(255) NOT NULL,
    "confirm" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(64) NOT NULL,
    "salt" VARCHAR(32) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestoreLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestoreLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RestoreLink" ADD CONSTRAINT "RestoreLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmLink" ADD CONSTRAINT "ConfirmLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
