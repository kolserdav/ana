/*
  Warnings:

  - Added the required column `ext` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `ext` VARCHAR(5) NOT NULL;
