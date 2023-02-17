-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` VARCHAR(191) NOT NULL,
    `tagId` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectTag` ADD CONSTRAINT `ProjectTag_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTag` ADD CONSTRAINT `ProjectTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Программирование'),
(2, 'Дизайн и арт'),
(6, 'Услуги'),
(8, 'Аудио и видео'),
(9, 'Продвижение'),
(12, 'Архитектура и инжиниринг'),
(10, 'Мобильные приложения'),
(13, 'Администрирование'),
(11, 'Аутсорсинг и консалтинг'),
(14, 'Переводы'),
(7, 'Работа с текстами');
INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(1, '1C'),
(1, 'Blockchain'),
(1, 'C и C++'),
(1, 'C#'),
(1, 'Delphi и Object Pascal'),
(1, 'Go'),
(1, 'Java'),
(1, 'Javascript'),
(1, 'Mac OS и Objective C'),
(1, 'Microsoft .NET'),
(1, 'Node.js'),
(1, 'PHP'),
(1, 'Python'),
(1, 'Ruby'),
(1, 'Swift'),
(1, 'Базы данных'),
(1, 'Веб-программирование'),
(1, 'Встраиваемые системы и микроконтроллеры'),
(1, 'Защита ПО и безопасность'),
(1, 'Машинное обучение'),
(1, 'Парсинг данных'),
(1, 'Прикладное программирование'),
(1, 'Разработка ботов'),
(1, 'Разработка игр'),
(1, 'Системное программирование'),
(1, 'Тестирование и QA');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(2, 'Баннеры'),
(2, 'Векторная графика'),
(2, 'Визуализация и моделирование'),
(2, 'Дизайн визиток'),
(2, 'Дизайн выставочных стендов'),
(2, 'Дизайн интерфейсов'),
(2, 'Дизайн интерьеров'),
(2, 'Дизайн мобильных приложений'),
(2, 'Дизайн сайтов'),
(2, 'Дизайн упаковки'),
(2, 'Живопись и графика'),
(2, 'Иконки и пиксельная графика'),
(2, 'Иллюстрации и рисунки'),
(2, 'Инфографика'),
(2, 'Логотипы'),
(2, 'Наружная реклама'),
(2, 'Обработка фото'),
(2, 'Оформление страниц в социальных сетях'),
(2, 'Полиграфический дизайн'),
(2, 'Предметный дизайн'),
(2, 'Разработка шрифтов'),
(2, 'Создание 3D-моделей'),
(2, 'Фирменный стиль');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(6, 'HTML и CSS верстка'),
(6, 'Видеосъемка'),
(6, 'Интеграция платежных систем'),
(6, 'Интернет-магазины и электронная коммерция'),
(6, 'Контент-менеджер'),
(6, 'Маркетинговые исследования'),
(6, 'Настройка ПО и серверов'),
(6, 'Обработка данных'),
(6, 'Обучение'),
(6, 'Поиск и сбор информации'),
(6, 'Прототипирование'),
(6, 'Работа с клиентами'),
(6, 'Разработка презентаций'),
(6, 'Рукоделие и хендмейд'),
(6, 'Создание сайта под ключ'),
(6, 'Сопровождение сайтов'),
(6, 'Установка и настройка CMS'),
(6, 'Фотосъемка');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(8, 'Анимация'),
(8, 'Аудио и видео монтаж'),
(8, 'Видеореклама'),
(8, 'Музыка'),
(8, 'Обработка аудио'),
(8, 'Обработка видео'),
(8, 'Транскрибация'),
(8, 'Услуги диктора');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(9, 'E-mail маркетинг'),
(9, 'SEO-аудит сайтов'),
(9, 'Контекстная реклама'),
(9, 'Поисковое продвижение (SEO)'),
(9, 'Поисковое управление репутацией (SERM)'),
(9, 'Покупка ссылок'),
(9, 'Продажи и генерация лидов'),
(9, 'Продвижение в социальных сетях (SMM)'),
(9, 'Реклама в социальных медиа'),
(9, 'Тизерная реклама');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(12, 'Архитектурные проекты'),
(12, 'Инжиниринг'),
(12, 'Ландшафтный дизайн'),
(12, 'Проектирование'),
(12, 'Чертежи и схемы');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(10, 'Гибридные мобильные приложения'),
(10, 'Разработка под Android'),
(10, 'Разработка под iOS (iPhone и iPad)');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(13, 'DevOps'),
(13, 'IP-телефония и VoIP'),
(13, 'Linux и Unix'),
(13, 'Windows'),
(13, 'Администрирование систем'),
(13, 'Геоинформационные системы'),
(13, 'Компьютерные сети');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(11, 'Бизнес-консультирование'),
(11, 'Бухгалтерские услуги'),
(11, 'Консалтинг'),
(11, 'Рекрутинг'),
(11, 'Управление клиентами и CRM'),
(11, 'Управление проектами'),
(11, 'Юридические услуги');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(14, 'Английский язык'),
(14, 'Иврит'),
(14, 'Испанский язык'),
(14, 'Итальянский язык'),
(14, 'Локализация ПО, сайтов и игр'),
(14, 'Немецкий язык'),
(14, 'Перевод текстов'),
(14, 'Французский язык');

INSERT INTO `Tag` (`categoryId`, `name`) VALUES
(7, 'Копирайтинг'),
(7, 'Написание статей'),
(7, 'Написание сценария'),
(7, 'Нейминг и слоганы'),
(7, 'Публикация объявлений'),
(7, 'Редактура и корректура текстов'),
(7, 'Рерайтинг'),
(7, 'Рефераты, дипломы, курсовые'),
(7, 'Стихи, песни, проза'),
(7, 'Техническая документация');