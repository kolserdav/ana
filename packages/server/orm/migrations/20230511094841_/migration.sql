-- CreateEnum
CREATE TYPE "PageName" AS ENUM ('index', 'login', 'registration', 'restorePassword', 'changePassword', 'confirmEmail', 'translate', 'my', 'policy', 'rules', 'contacts');

-- CreateEnum
CREATE TYPE "PageField" AS ENUM ('title', 'description', 'keywords', 'content');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('ru', 'en');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('info', 'warn', 'error');

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
    "password" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Phrase" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "translate" VARCHAR(1500),
    "userId" TEXT NOT NULL,
    "nativeLang" VARCHAR(2) NOT NULL,
    "learnLang" VARCHAR(2) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhraseTag" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "phraseId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhraseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMessage" (
    "id" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "lang" "Lang" NOT NULL,
    "text" TEXT NOT NULL,
    "comment" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Online" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Online_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RestoreLink" ADD CONSTRAINT "RestoreLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmLink" ADD CONSTRAINT "ConfirmLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhraseTag" ADD CONSTRAINT "PhraseTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhraseTag" ADD CONSTRAINT "PhraseTag_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
