# Add interface language

1. Create folder with two letter name of locale in `packages/server/src/locales`
2. Put in this folder file `lang.ts`. As sample use [packages/server/src/locales/en/lang.ts](./packages/server/src/locales/en/lang.ts)
3. Add the locale value in `packages/app/next.config.js` to `i18n.locales` array
4. Add the locale value in `packages/app/types/interfaces.ts`:

```typescript
export type LocaleValue = 'ru' | 'en' | '[new locale]';
```

5. Add a locale name in `packages/app/utils/constants.ts`:

```typescript
export const LOCALE_NAMES: Record<LocaleValue, string> = {
  en: 'English',
  ru: 'Русский',
  [new locale value]: 'New lang name'
};
```

6. Add the locale in `packages/server/src/utils/getLocale.ts`;

```typescript
import ru from '../locales/ru/lang';
import en from '../locales/en/lang';
import [new locale] from '../locales/[new locale]/lang';

const locales: Record<string, Locale> = {
  ru,
  en,
  [new locale]
};
```

7. Add the locale in `scripts/server-reload-messages.js`

```typescript
const en = require('../packages/server/dist/locales/en/lang.js').default;
const ru = require('../packages/server/dist/locales/ru/lang.js').default;
const [new locale] = require('../packages/server/dist/locales/[new locale]/lang.js').default;
const langs = {
  en,
  ru,
  [new locale]
};
```

8. Add the locale value in `packages/server/orm/schema.prisma`;

```prisma
enum Lang {
  ru
  en
  [new locale]
}
```

8. Create a migration:

```sh
npm run migrate:dev
```
