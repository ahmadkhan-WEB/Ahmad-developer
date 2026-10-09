# NaviSense

A responsive landing page for a smart indoor navigation app, built with Vite, React, TypeScript, Tailwind CSS, and Framer Motion.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

The sign-in and create-account pages run in demo mode: submitting either form opens the landing page without sending or saving the entered details. No database or API setup is needed to preview the website.

## Optional standalone MySQL API

The API remains available for development, but the demo sign-in and create-account pages do not use it. To run the API separately, first configure the database as described below, then start it in a second terminal:

```bash
npm run dev:api
```

Vite prints the local development URL after it starts and proxies `/api` requests to the optional API.

## MySQL authentication setup

1. Run `server/schema.sql` using MySQL Workbench or the MySQL client. It creates the `navisense` database, `users` table, and hashed-session table.
2. Create a database user with access limited to this app's database:

   ```sql
   CREATE USER 'navisense_app'@'localhost' IDENTIFIED BY 'choose-a-strong-password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON navisense.* TO 'navisense_app'@'localhost';
   ```

3. Copy `.env.example` to `.env` and set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`. Never commit `.env`.
4. Run `npm run dev` and `npm run dev:api` in separate terminals to start the standalone API.

The standalone API hashes passwords with bcrypt and stores hashed session tokens in MySQL. The demo UI does not call these endpoints.

If deploying the standalone API, serve it and the frontend over HTTPS on the same origin (or configure a secure reverse proxy for `/api`), set `NODE_ENV=production`, and provide the database settings through the hosting environment. Do not expose MySQL credentials or connect to MySQL directly from browser code.

## Build and preview

```bash
npm run build
npm run preview
```

## Project layout

- `src/sections/` contains the landing page sections.
- `src/components/` is reserved for shared UI components.
- `src/hooks/` contains theme and count-up hooks.
- `src/data/` contains feature, destination, screen, and footer content.
- `public/screens/` contains the 21 supplied app screenshots; the carousel adds a custom preview for missing Screen 08 and continuously loops all 22 screens.

Reviews and venue-routing content are demonstrations. Sign-in and account creation are demo-only and simply open the landing page; entered details are not saved.