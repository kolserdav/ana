import { Locale } from '../../types/interfaces';

const lang: Locale = {
  server: {
    error: 'Ошибка сервера',
    badRequest: 'Неверный запрос',
    notFound: 'Не найдено',
    success: 'Успешный запрос',
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
      formDesc: 'Поля помеченные * обязательны для заполенения',
      tabs: [
        {
          id: 0,
          title: 'Заказчик',
          content: 'Вы сможете создавать заказы и контролировать ход их выполнения',
        },
        {
          id: 1,
          title: 'Исполнитель',
          content: 'Вы сможете принимать заказы и зарабатывать деньги своим трудом',
        },
      ],
      tabDefault:
        'Выберите тип учетной записи.<br><br> <i>В дальнейшем вы сможете переключаться между ними</i>',
      password: 'Пароль',
      passwordRepeat: 'Повтор пароля',
      fieldMustBeNotEmpty: 'Поле не должно быть пустым',
      fieldProhibited: 'Поле содержит запрещенные символы',
      passwordMinLengthIs: 'Минимальная длина пароля',
      passwordMustContain: 'Пароль должен содержать хотя-бы одну ',
      number: 'цифру',
      letter: 'букву',
      passwordsDoNotMatch: 'Пароли не совпадают',
      emailIsUnacceptable: 'Почта имеет недопустимый вид',
      neededSelect: 'Необходимо сделать выбор',
      eliminateRemarks: 'Устраните замечания в форме',
      emailIsNotRegistered: 'Данная почта не зарегистрирована на сервисе',
      emailIsRegistered: 'На данную почту уже существует учетная запись',
    },
    appBar: {
      darkTheme: 'Темная тема',
    },
  },
};

export default lang;
