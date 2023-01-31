/*
  Warnings:

  - You are about to alter the column `salt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `salt` VARCHAR(32) NOT NULL;
