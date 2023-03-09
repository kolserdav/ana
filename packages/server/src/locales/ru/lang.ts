import { Locale } from '../../types/interfaces';

const lang: Locale = {
  server: {
    error: 'Ошибка сервера',
    badRequest: 'Неверный запрос',
    notFound: 'Не найдено',
    success: 'Успешный запрос',
    wrongPassword: 'Неверный логин или пароль',
    emailIsSend: 'На указанную почту отправлено письмо с инструкцией',
    linkExpired: 'Просроченная ссылка',
    linkUnaccepted: 'Недействительная ссылка',
    letterNotSend:
      'Учетная запись создана, но письмо подтверждения почты не отправлено из-за ошибки',
    successConfirmEmail: 'Данная почта успешно подтверждена',
    forbidden: 'Доступ запрещен',
    unauthorized: 'Недостаточно прав',
    someFilesNotSaved: 'Некоторые файлы не могут быть сохранены',
    notImplement: 'Устаревшая версия запроса',
    unacceptedImage: 'Неподдерживаемый формат изображения',
    maxFileSize: 'Превышен допустимый размер загружаемого файла',
    projectCreateButFilesNotSaved: 'Проект создан. Но некоторые файлы не могли быть приклеплены',
    sendToSupport: 'Обратитесь в техподдержку',
  },
  app: {
    login: {
      loginButton: 'Войти',
      register: 'Зарегистрироваться',
      signIn: 'Войти в существующий аккаунт',
      signUp: 'Зарегистрировать новый аккаунт',
      email: 'Почта',
      name: 'Имя',
      surname: 'Фамилия',
      accountType: 'Зарегистрировать как',
      tabs: [
        {
          id: 0,
          value: 'employer',
          title: 'Заказчик',
          content: 'Вы сможете создавать заказы и контролировать ход их выполнения',
        },
        {
          id: 1,
          value: 'worker',
          title: 'Исполнитель',
          content: 'Вы сможете принимать заказы и зарабатывать деньги своим трудом',
        },
      ],
      tabDefault:
        'Выберите тип учетной записи.<br><br> <i>В дальнейшем вы сможете переключаться между ними</i>',
      password: 'Пароль',
      passwordRepeat: 'Повтор пароля',
      fieldProhibited: 'Поле содержит запрещенные символы',
      passwordMinLengthIs: 'Минимальная длина пароля',
      passwordMustContain: 'Пароль должен содержать хотя-бы одну ',
      number: 'цифру',
      letter: 'букву',
      passwordsDoNotMatch: 'Пароли не совпадают',
      emailIsUnacceptable: 'Почта имеет недопустимый вид',
      neededSelect: 'Необходимо сделать выбор',
      emailIsNotRegistered: 'Данная почта не зарегистрирована на сервисе',
      emailIsRegistered: 'На данную почту уже существует учетная запись',
      successLogin: 'Успешный вход',
      successRegistration: 'Успешная регистрация',
      forgotPassword: 'Забыли пароль?',
      restorePassword: 'Восстановление пароля',
      sendRestoreMail: 'Отправить письмо',
      restoreDesc: 'На указанную почту будет выслано письмо с инструкцией по восстановлению пароля',
      changePassword: 'Сменить пароль',
      newPassword: 'Новый пароль',
      save: 'Сохранить',
      wrongParameters: 'Неверные параметры страницы',
      sendNewLetter: 'Запросить новое письмо для восстановления пароля',
    },
    appBar: {
      darkTheme: 'Темная тема',
      homePage: 'Главная',
      login: 'Вход',
      logout: 'Выход',
      personalArea: 'Личный кабинет',
      createProject: 'Создать проект',
    },
    confirmEmail: {
      title: 'Подтверждение почты',
      paramsNotFound: 'Не найдены необходимые параметры страницы',
    },
    me: {
      myProjects: 'Мои проекты',
      projectsIsMissing: 'В настоящее время проекты отсутствуют',
      files: 'Файлов',
    },
    createProject: {
      createProject: 'Создать новый проект',
      projectTitle: 'Название проекта',
      projectDescription: 'Описание проекта',
      projectDesPlaceholder:
        'Подробно опишите что нужно сделать и по каким критериям будете оценивать результат',
      projectActualFor: 'Актуален до',
      projectAddFilesDesc:
        'Загрузите файлы с дополнительной информацией о проекте. В дальнейшем вы сможете добавить и другие файлы',
      projectDragDropFiles: 'Или перетяните файлы в эту область',
      projectDateTooltip:
        'Дата, не позднее которой, по вашим подсчетам, проект должен быть завершен',
      maxFileSizeIs: 'Максимальный размер файла',
      withoutCategory: 'Без категории',
      categoryHelp:
        'Начисление дополнительного рейтинга по каждой выбранной подкатегории. Можно выбрать подкатегории только из одной категории! Максимальное количество:',
      categoryLabel: 'Категория',
      buttonCreate: 'Создать',
      projectCreated: 'Проект успешно добавлен',
    },
    common: {
      formDesc: 'Поля помеченные * обязательны для заполенения',
      showHelp: 'Показать справку',
      somethingWentWrong: 'Что-то пошло не так',
      maxFileSize: 'Файл слишком большой',
      fieldMustBeNotEmpty: 'Поле не должно быть пустым',
      eliminateRemarks: 'Устраните замечания в форме',
      projectAddFiles: 'Прикрепить файлы',
    },
    projectStatus: {
      finished: 'Закончен',
      inWork: 'В работе',
      waitEmployer: 'Ожидает заказчика',
      waitWorker: 'Ожидает исполнителя',
      agreementOfConditions: 'Согласование условий',
    },
  },
};

export default lang;
