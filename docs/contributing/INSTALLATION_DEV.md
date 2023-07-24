# Installation for contributing

## Dependencies

```sh
NodeJS: ^18.0

Python: ^3.7 + pip ^19.3 (or docker-compose)

PostgreSQL: ^15.0 (or docker-compose)

Sentencepiece CLI @latest(or docker-compose)

```

## Installation

1. Clone source code:

```sh
git clone https://github.com/kolserdav/ana.git
```

2. Install dependencies:

Change working directory:

```sh
cd ana
```

---

Install node dependencies when the system dependencies installed:

```sh
npm i
```

When it's via **Docker**:

```
npm run install:node
```

---

### Environment variables

3. Set up server environment file `.env`.
4. Set up client environment file `packages/app/.env`.
5. Set up translate environment file `packages/translate/.env`.

   **After the first installation, the environment variable files will be copied from the examples, next time you need to follow the updates of `.env.example` and make changes to the `.env` files yourself.**

   **or** renew `.env` from `.env.example`

   ```sh
   npm run scripts:copy-env renew
   ```

---

6. Run migrations:

```sh
npm run migrate
```

---

For first installation you can run

```sh
npm run seed
```

to populate the database with sample pages

---

7. Run in development mode:

---

When the dependencies installed

```sh
npm run dev
```

---

When its via **Docker**

Run containers:

```sh
docker-compose up -d -f docker-compose.dev.yml
```

Start server and client:

```sh
npm run dev:node
```

---

_Then open in your browser the page http://localhost:3000_
