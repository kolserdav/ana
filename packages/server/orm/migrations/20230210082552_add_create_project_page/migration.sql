-- AlterTable
ALTER TABLE `Page` MODIFY `name` ENUM('index', 'login', 'registration', 'restorePassword', 'changePassword', 'confirmEmail', 'meEmployer', 'meEmployerCreateProject', 'meWorker') NOT NULL;
