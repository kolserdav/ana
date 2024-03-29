import {
  Locale,
  LocaleVars,
  SEARCH_MIN_LENGTH,
  MINIMAL_SUPPORT_TEXT_LENGTH,
} from '../../types/interfaces';

const lang: Locale = {
  server: {
    error: 'Ошибка сервера',
    badRequest: 'Неверный запрос',
    notFound: 'Не найдено',
    success: 'Успешный запрос',
    wrongPassword: 'Неверная почта или пароль',
    emailIsSend: 'На указанную почту отправлено письмо с инструкцией.',
    linkExpired: 'Просроченная ссылка',
    linkUnaccepted: 'Недействительная ссылка',
    letterNotSend:
      'Учетная запись создана, но письмо подтверждения почты не отправлено из-за ошибки',
    successConfirmEmail: 'Данная почта успешно подтверждена',
    forbidden: 'Доступ запрещен',
    unauthorized: 'Недостаточно прав',
    notImplement: 'Устаревшая версия запроса',
    sendToSupport: 'Обратитесь в техподдержку',
    phraseSaved: 'Текст(ы) сохранен(ы)',
    tagExists: 'Метка была создана ранее',
    tagSaved: 'Метка сохранена',
    phraseDeleted: 'Текст(ы) удалена(ы)',
    phraseLoad: 'Текст загружен из базы данных',
    tagDeleted: 'Метка удалена',
    tagUpdated: 'Метка изменена для всех текстов',
    serverReload: 'Перезагрузка сервера. Это может занять несколько минут.',
    mailSubjects: {
      confirmEmail: 'Подтверждение почты',
      resetPassword: 'Сброс пароля',
      deletedAccount: 'Учетная запись удалена',
    },
    translateServiceNotWorking: 'Извините, сервис перевода временно недоступен',
    supportSuccess: 'Заявка отправлена в теническую поддержку',
    pushNotificationSaved: 'Уведомление сохранено',
    pushNotificationDeleted: 'Уведомление удалено',
  },
  app: {
    login: {
      loginButton: 'Войти',
      register: 'Зарегистрироваться',
      signIn: 'Войти в существующий аккаунт',
      signUp: 'Зарегистрировать новый аккаунт',
      email: 'Почта',
      name: 'Имя',
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
      restoreDesc: 'На указанную почту будет выслано письмо с инструкцией по восстановлению пароля',
      changePassword: 'Сменить пароль',
      newPassword: 'Новый пароль',
      save: 'Сохранить',
      wrongParameters: 'Неверные параметры страницы',
      sendNewLetter: 'Запросить новое письмо для восстановления пароля',
      acceptPolicyAndRules: 'Перед тем как продолжить я ознакомился и принимаю',
      subtitle: 'Для сохранения текстов необходимо авторизоваться на сервисе',
    },
    appBar: {
      darkTheme: 'Темная тема',
      homePage: 'Главная',
      login: 'Вход',
      logout: 'Выход из аккаунта',
      translate: 'Перевод',
      myDictionary: 'Мои тексты',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      statistics: 'Статистика',
      changeInterfaceLang: 'Сменить язык интерфейса',
      about: 'О приложении',
      closeApp: 'Закрыть приложениe',
      settings: 'Настройки',
      logoutDesc:
        'Если вы выйдете из аккаунта, тогда вы не будете иметь доступа к сохраненным вами меткам и текстам, а также не сможете создавать новые.',
      yes: 'Да',
      no: 'Нет',
      cancel: 'Отмена',
      send: 'Отправить',
      support: {
        title: 'Поддержка',
        description: 'Написать письмо в техническую поддержку.',
        warning: 'Чтобы написать в поддержку сначала подтвердите вашу почту, для этого перейдите в',
        subject: 'Тема письма',
        text: 'Задайте вопрос или напишите предложение',
        subjectMustBeNotEmpty: 'Тема обращения не должна быть пустой',
        minimalLengthOfTextIs: `Минимум ${MINIMAL_SUPPORT_TEXT_LENGTH} символов`,
      },
      trash: 'Выученные тексты',
      adminArea: 'Кабинет администратора',
    },
    confirmEmail: {
      title: 'Подтверждение почты',
      paramsNotFound: 'Не найдены необходимые параметры страницы',
      goBack: 'Назад',
    },
    common: {
      formDesc: 'Поля помеченные * обязательны для заполенения',
      showHelp: 'Показать справку',
      somethingWentWrong: 'Что-то пошло не так',
      fieldMustBeNotEmpty: 'Поле не должно быть пустым',
      eliminateRemarks: 'Устраните замечания в форме',
      save: 'Сохранить',
      edit: 'Изменить',
      delete: 'Удалить',
      cancel: 'Отмена',
      policyTitle: 'Политика конфиденциальности',
      rulesTitle: 'Правила сервиса',
      and: 'и',
      voiceNotFound: 'Специальный голос для озвучивания не найден',
      playSound: 'Озвучить текст',
      sendMail: 'Отправить письмо',
      emailIsSend: 'Если письмо не приходит длительное время, то проверьте папку "Спам"',
      openTools: 'Открыть инструменты',
      copyText: {
        title: 'Скопировать текст',
        textCopied: 'Текст скопирован',
        copyTextError: 'Ошибка при копировании текста',
      },
      dateFilter: {
        forDay: 'за день',
        forWeek: 'за неделю',
        forMonth: 'за месяц',
        forThreeMoths: 'за три месяца',
        forSixMonths: 'за полгода',
        forYear: 'за год',
        forAllTime: 'за всё время',
      },
      sort: {
        byAlpha: 'По алфавиту',
        byNumeric: 'По количеству',
      },
      wrongUrlFormat: 'Неверный формат адреса',
      openInApp: 'Открыть в приложении',
      needUpdateApp:
        'Приложение должно быть обновлено до последней версии, чтобы поддерживать все функции',
    },
    translate: {
      title: 'Составление предложений',
      description:
        'Тренируйте свой навык составления предложений на текстах, которые вы будете использовать',
      descEdit: 'Совершенствуйте составленные предложения по мере роста ваших навыков',
      nativeLang: 'Знаю',
      learnLang: 'Изучаю',
      allowRecomend: 'Применить предложенный вариант',
      savePhrase: 'Сохранить текст',
      createPhrase: 'Создать текст',
      needLogin: 'Необходим вход в учетную запись',
      savePhraseDesc:
        'Сохраните текст на память. После вы сможете в любое время изменить её или удалить',
      saveTranlsate: 'Сохранить вместе с переводом',
      newTag: 'Новая метка',
      changeTag: 'Изменение метки',
      tagsTitle: 'Метки',
      tagHelp: 'Введите пробел после названия метки, чтобы она сохранилась',
      addTags: 'Добавить метки',
      updatePhrase: 'Редактирование текста',
      deleteTag: 'Удалить метку',
      deleteTagDesc: 'Также будут удалены все связи метки с текстами',
      updateTag: 'Обновить метку',
      textareaPlaceholder: 'Пишите на языке, который изучаете',
      copied: 'Скопировано в буфер',
      swapLangs: 'Поменять языки местами',
      cleanField: 'Очистить поле',
      quitEdit: 'Выйти из режима редактирования',
      startRecognize: 'Удерживать для распознания речи',
      errorSpeechRecog: 'Ошибка при распознании речи',
      recognizeNotSupport: 'Распознание речи не поддерживается',
      microNotPermitted: 'Разрешение на использование микрофона не получено',
      serverIsNotConnected: 'Сервер недоступен или клиент не поддерживает протокол',
      undo: 'Отменить последнюю операцию',
      closeUpdateTag: 'Закрыть изменение метки',
    },
    my: {
      title: 'Мои тексты',
      deletePhrase: 'Удалить запись',
      updatePhrase: 'Изменить текст',
      byUpdateDate: 'По времени изменения',
      filterByTags: 'Фильтр по меткам',
      strongAccord: 'Строгое соответствие',
      emptyPhrases: 'По заданному фильтру тексты не найдены',
      pagination: `Показано: ${LocaleVars.show} из ${LocaleVars.all}`,
      minimalSearchLenght: `Минимум ${SEARCH_MIN_LENGTH} символa в слове`,
      allLangs: 'все языки',
      selectAll: 'Выбрать все',
      unselectAll: 'Снять все выделения',
      deleteSelected: 'Удалить выбранные',
      moveSelectedToTrash: 'Переместить выбранные в выученное',
      willDelete: `Будет удалено ${LocaleVars.count} текстов(а)`,
      resetAllFilters: 'Сбросить фильтры',
      playAll: 'Воспроизвести все',
      selectPhrase: 'Выбрать текст',
      translation: 'Перевод',
      reTranslation: 'Обратный перевод',
      trash: 'Выученные тексты',
      moveToTrash: 'Переместить в выученное',
      deleteImmediatly: 'Удалить сразу',
      cleanTrash: 'Очистить выученное',
      cleanTrashDesc: 'Все тексты будут безвозвратно удалены из выученного',
    },
    app: {
      connectionRefused: 'Соединение с сервером потеряно',
      connectionReOpened: 'Соединение с сервером восстановлено',
      acceptCookies:
        'Мы используем файлы куки продолжая использовать приложение вы подтверждаете что ознакомились и принимаете нашу',
      ok: 'Ладно',
      withPolicy: 'Политику конфиденциальности',
    },
    about: {
      aboutProgram: 'О приложении',
      licenseTitle: 'Распостраняется по лицензии',
      repoTitle: 'Исходный код',
      aboutSite: 'Об этом сервисе',
      contactsTitle: 'Контакты',
      donate: 'Пожертвовать',
      packageVersion: 'Версия приложения',
      download: 'Скачать последнюю версию',
      aboutTranslate: 'О модуле переводчика',
    },
    settings: {
      title: 'Настройки',
      speechSpeed: 'Скорость речи',
      speechTest: 'Тест озвучивания',
      speechLang: 'Язык озвучивания',
      speechVoice: 'Голос озвучивания',
      speechSettings: 'Настройки озвучивания',
      personalData: 'Личные данные',
      deleteAccountTitle: 'Удалить аккаунт',
      deleteAccountDesc:
        'Внимание! Удаление аккаунта приведет к удалению всех созданных вами текстов и меток, а также вы больше не сможете авторизоваться на нашем сервисе.',
      deleteAccountSecure: 'Для подтверждения удаления аккаунта введите',
      deleteVerifying: 'Подверждение удаления',
      deleteMyAccount: 'удалить мой аккаунт',
      deleteAccountWarning:
        'Я понимаю, что данную операцию нельзя будет отменить. Аккаунт будет удален сразу и навсегда.',
      changePassword: 'Сменить пароль',
      emailIsConfirmed: 'Почта подтверждена',
      sendConfirmEmail: 'Отправить письмо для подтверждения почты',
      selectNode: 'Выбрать источник',
      defaultNode: 'Источник по умолчанию',
      customNode: 'Пользовательский источник',
      serverIsNotRespond: 'Сервер не отвечает',
      saveVoiceTestText: 'Сохранять для каждого голоса',
      saveAllTestText: 'Сохранять для всех голосов',
      successCheckNode: 'При следующем запуске приложение будет запущенно с указанного сервера',
      notifications: {
        title: 'Настройка уведомлений',
        label: 'Получать уведомления',
        description:
          'Мотивирующие напоминания. Мы постараемся чтобы они не были слишком навязчивыми.',
      },
      powerSettings: {
        title: 'Настройки производительности',
        label: 'Не закрывать соединение при закрытом приложении',
        description: 'Быстрый запуск или экономия',
      },
    },
    statistics: {
      title: 'Статистика',
      description: 'Следите за вашей статистикой, чтобы лучше контролировать свой учебный план',
      newTexts: 'Создано текстов',
      updatedTexts: 'Отредактировано текстов',
      trashedText: 'Выучено текстов',
      studyTime: 'Времени в занятиях',
      dateDuration: {
        days: 'дней',
        months: 'месяцев',
        years: 'лет',
        hours: 'часов',
        minutes: 'минут',
        seconds: 'секунд',
      },
    },
    admin: {
      pushNotifications: 'Кликабельные уведомления',
      createPushNotification: 'Создать кликабельное уведомление',
      editPushNotification: 'Изменить уведомление',
      deletePushNotification: 'Удалить уведомление',
      titleMustBeNotEmpty: 'Заголовок уведомления не должен быть пустым',
      pushTitle: 'Заголовок уведомления',
      pushBody: 'Текст уведомления',
      pushLanguage: 'Язык уведомления',
      pushPath: 'Страница',
      pushPriority: 'Приоритет уведомления',
    },
  },
};

export default lang;
