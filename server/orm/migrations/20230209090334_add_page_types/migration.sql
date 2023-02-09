-- AlterTable
ALTER TABLE `Page` MODIFY `name` ENUM('index', 'login', 'registration', 'restorePassword', 'changePassword', 'confirmEmail', 'meEmployer', 'meWorker') NOT NULL;
