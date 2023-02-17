/*
  Warnings:

  - You are about to drop the column `mime` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - Added the required column `fieldname` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` DROP COLUMN `mime`,
    DROP COLUMN `name`,
    ADD COLUMN `fieldname` VARCHAR(191) NOT NULL,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL,
    ADD COLUMN `mimetype` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `size` INTEGER NULL;
