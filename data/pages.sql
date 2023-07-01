-- Data for scripts/seed/insert-pages.js
INSERT INTO public."Page" VALUES (1, 'contacts', 'title', 'Данные о владельце ресурса', 'ru') ;
INSERT INTO public."Page" VALUES (2, 'contacts', 'title', 'Resource owner information', 'en') ;
INSERT INTO public."Page" VALUES (3, 'contacts', 'content', '<p>контакты</p>', 'ru') ;
INSERT INTO public."Page" VALUES (4, 'contacts', 'content', '<p>contacts</p>', 'en') ;

INSERT INTO public."Page" VALUES (5, 'policy', 'content', '<p>Политика конфиденциальности</p>', 'ru') ;
INSERT INTO public."Page" VALUES (6, 'policy', 'title', 'Политика конфиденциальности', 'ru') ;
INSERT INTO public."Page" VALUES (7, 'policy', 'title', 'Privacy Policy', 'en') ;
INSERT INTO public."Page" VALUES (8, 'policy', 'content', '<p>Privacy Policy</p>', 'en') ;

INSERT INTO public."Page" VALUES (9, 'rules', 'title', 'Terms of Use
    Tes
', 'en') ;
INSERT INTO public."Page" VALUES (10, 'rules', 'title', 'Правила использования', 'ru') ;
INSERT INTO public."Page" VALUES (11, 'rules', 'content', '<p>Terms of use</p>', 'en') ;
INSERT INTO public."Page" VALUES (12, 'rules', 'content', '<p>правила использования</p>', 'ru') ;

INSERT INTO public."Page" VALUES (13, 'about', 'title', 'О программе и о сервисе', 'ru') ;
INSERT INTO public."Page" VALUES (14, 'about', 'title', 'About the program and service', 'en') ;

INSERT INTO public."Page" VALUES (15, 'translate', 'title', 'Составление предложений', 'ru') ; 
INSERT INTO public."Page" VALUES (16, 'translate', 'title', 'Making sentences', 'en') ;
INSERT INTO public."Page" VALUES (17, 'translate', 'description', 'Приложение помогающее изучать иностранный язык. 
Составляйте приложения на языке, который вы изучаете, а алгоритм перевода поправит вас в случае ошибки.', 'ru') ; 
INSERT INTO public."Page" VALUES (18, 'translate', 'description', 'An application that helps you learn a foreign language. 
Compose applications in the language you are learning and the translation algorithm will correct you if you make a mistake', 'en') ;
INSERT INTO public."Page" VALUES (29, 'translate', 'keywords', 'блокнот,переводчик,писать предложения,изучать язык', 'ru');
INSERT INTO public."Page" VALUES (20, 'translate', 'keywords', 'notepad, translator, write sentences, learn language', 'en') ;