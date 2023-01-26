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
      email: 'Почта',
      name: 'Имя',
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
    },
  },
};

export default lang;
