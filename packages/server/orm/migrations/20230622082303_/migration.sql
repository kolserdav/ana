-- CreateEnum
CREATE TYPE "SelectorNames" AS ENUM ('textarea', 'translate');

-- CreateTable
CREATE TABLE "Selector" (
    "id" SERIAL NOT NULL,
    "type" "SelectorNames" NOT NULL,
    "value" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Selector_pkey" PRIMARY KEY ("id")
);
