-- AlterTable
ALTER TABLE `Page` MODIFY `name` ENUM('index', 'login') NOT NULL,
    MODIFY `field` ENUM('title', 'description', 'keywords', 'content') NOT NULL;
