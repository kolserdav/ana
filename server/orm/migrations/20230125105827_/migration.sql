/*
  Warnings:

  - You are about to drop the column `created` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Page` DROP COLUMN `created`,
    DROP COLUMN `updated`;
