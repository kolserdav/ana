-- CreateTable
CREATE TABLE `Page` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('index') NOT NULL,
    `field` ENUM('title', 'description') NOT NULL,
    `value` VARCHAR(1000) NOT NULL,
    `lang` ENUM('ru') NOT NULL,
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
