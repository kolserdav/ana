-- AlterTable
ALTER TABLE `Page` MODIFY `name` ENUM('index', 'login', 'registration', 'restorePassword', 'changePassword') NOT NULL;
