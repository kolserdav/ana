# Installation to a local machine

## Dependencies

```sh
NodeJS: 18
Python: ^3.7 + pip ^19.3 (or docker-compose)
PostgreSQL: ^15.0 (or docker-compose)
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
5. Set up translate environment file `packages/translate/.env`.
6. Run migrations:

```sh
npm run migrate
```

7. Run in development mode:

```sh
npm run dev
```

_Then open in your browser the page http://localhost:3000_
