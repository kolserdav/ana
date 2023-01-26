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
      login: 'Логин',
      loginButton: 'Войти',
      register: 'Зарегистрироваться',
      signIn: 'Войти в существующий аккаунт',
      signUp: 'Зарегистрировать новый аккаунт',
      email: 'Почта',
      name: 'Имя',
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
        'Выберите тип учетной записи.<br><br> В дальнейшем вы сможете переключаться между ними',
      password: 'Пароль',
      paswordRepeat: 'Повтор пароля',
      loginOrEmal: 'Логин или почта',
    },
  },
};

export default lang;
