# Ana

Application for easy composing phrases in the target language.

## Dependencies

```sh
NodeJS: 18
Python 3 + pip
PostgreSQL: latest
```

## Installation

1. Clone source code:

```sh
git clone https://github.com/kolserdav/ana.git
```

2. Install dependencies:

```sh
cd ana
npm i
```

3. Set up server environment file `.env`.
4. Set up client environment file `packages/app/.env`.
5. Run migrations:

```sh
npm run migrate
```

6. Run in development mode:

```sh
npm run dev
```

_Then open in your browser the page http://localhost:3000_
