# Mariel Creatives

A responsive creator portfolio for **Mariel Creatives**, styled with a maroon-and-pink palette, layered glass cards, and raised 3D-style social media icons. The portfolio also includes a small **Content Studio** so creator posts can be saved and managed from the website.

The Content Studio is a working full-stack example of database connectivity and ORM-based CRUD operations:

- **Create** – add a content record with its platform, content type, status, views, link, and description.
- **Read** – retrieve records from SQLite and display them in the dashboard.
- **Update** – edit a saved content record.
- **Delete** – remove a saved record from the database.

Records are persisted in a local SQLite database file (`dev.db`). They remain available after the development server is closed and restarted.

## Technologies

| Technology | Purpose |
|---|---|
| React | Portfolio interface and interactive Content Studio |
| Vite | Frontend development server and production build |
| Node.js + Express | Backend API for content records and database health checks |
| Prisma ORM 7 | Data model, migrations, and database CRUD queries |
| SQLite | Local persistent relational database |
| TypeScript / TSX | Backend source and Prisma configuration |
| Git + GitHub | Source control and project hosting |

## Project structure

```text
mariel-creatives/
├── prisma/
│   ├── migrations/
│   │   ├── 20261117000000_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── server/
│   ├── index.ts          # Express API and CRUD routes
│   ├── prisma.ts         # Prisma Client + SQLite adapter
│   └── seed.ts           # Optional sample content records
├── src/
│   ├── components/
│   │   └── ContentStudio.jsx
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── vite.config.js
```

## Requirements

- Node.js **20.19.0+**, **22.12.0+**, or **24.0.0+** (supported Prisma ORM 7 release lines)
- npm
- Git (optional, for pushing the project to GitHub)

Check your installed versions:

```bash
node --version
npm --version
```

## Database configuration

This project uses SQLite so it can run locally without a separate database server.

1. In the project root, create your local environment file:

   **Windows Command Prompt:**
   ```bat
   copy .env.example .env
   ```

   **PowerShell / macOS / Linux:**
   ```bash
   cp .env.example .env
   ```

2. The example `.env` contains:

   ```env
   DATABASE_URL="file:./dev.db"
   PORT=5000
   ```

   `DATABASE_URL` points Prisma's SQLite adapter to the `dev.db` file in the project root. You can change the path if needed, but keep the same value in the Prisma CLI configuration and runtime environment.

3. The database schema is defined in `prisma/schema.prisma`. The `CreatorPost` model stores the title, platform, content type, status, views, optional post link and description, plus created/updated timestamps.

The database file and `.env` are intentionally excluded from Git by `.gitignore`. The migration files are committed, so another developer can recreate the database locally.

## Install and run

Open a terminal in the `mariel-creatives` project folder.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` (see Database configuration above).

3. Generate Prisma Client, apply the database migration, and insert sample records:

   ```bash
   npm run setup
   ```

   The setup script runs these steps:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

   The seed step inserts three sample posts only when the database is empty. It will not overwrite existing content.

4. Start the React frontend and Express backend together:

   ```bash
   npm run dev
   ```

5. Open the Vite URL shown in the terminal (normally **http://localhost:5173**). The frontend sends `/api` requests to the Express backend on port `5000`.

To stop the app, press `Ctrl + C` in the terminal.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite and the Express API in development mode |
| `npm run build` | Builds the React frontend into `dist/` |
| `npm start` | Starts the Express server (serves `dist/` too when a production build exists) |
| `npm run setup` | Generates Prisma Client, applies migrations, and seeds sample data |
| `npm run db:generate` | Generates the Prisma Client from the schema |
| `npm run db:migrate` | Applies schema migrations during development |
| `npm run db:seed` | Inserts sample posts if the database is empty |
| `npm run db:studio` | Opens Prisma Studio to inspect database records |

## CRUD API reference

The Express API is available under `/api`:

| Method | Endpoint | Action |
|---|---|---|
| `GET` | `/api/health` | Checks the server and database connection |
| `GET` | `/api/content` | Retrieves all creator content records |
| `POST` | `/api/content` | Creates a content record |
| `PUT` | `/api/content/:id` | Updates a content record |
| `DELETE` | `/api/content/:id` | Deletes a content record |

Example request body for `POST` or `PUT`:

```json
{
  "title": "My everyday product finds",
  "platform": "TikTok",
  "contentType": "Shop affiliate video",
  "status": "Published",
  "views": 1200,
  "link": "https://www.tiktok.com/",
  "description": "A short product feature."
}
```

The frontend displays the database connection status, record count, published count, and total views. It also supports search and status filters.

## Inspect the database

Run:

```bash
npm run db:studio
```

Prisma Studio opens a browser interface where you can inspect the `CreatorPost` table and its saved records. Keep the terminal running while using Studio.

## Personalize the portfolio

Before publishing, update these sample details:

1. In `src/App.jsx`, replace `@yourtiktokhandle` and the social platform placeholder labels with your actual public handles.
2. Update each `href` in the `socialLinks` array with your profile URL. Replace the TikTok destination in the contact section with your actual TikTok profile URL.
3. Edit the introduction and creator description in `src/App.jsx` to match your preferred bio and content niche.
4. Adjust colors, spacing, or typography in `src/styles/global.css`.

The current social destinations are platform homepages, not links to personal accounts. Update them before sharing the portfolio publicly.

## Push the project to GitHub

Create an empty repository on GitHub, then run these commands from the project folder (replace the URL with your repository URL):

```bash
git init
git add .
git commit -m "Initial commit: Mariel Creatives portfolio and Prisma CRUD app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mariel-creatives.git
git push -u origin main
```

Do **not** commit `.env`, `dev.db`, or `node_modules`. The `.gitignore` file already excludes them.

### Deployment note

GitHub is suitable for storing and versioning this source code, but **GitHub Pages only serves static files**. This project has an Express API and a SQLite database, so the complete application must run on a Node.js-capable host with persistent disk storage (or be adapted to a hosted database). A static-only GitHub Pages deployment will show the frontend but will not provide the working Prisma CRUD API.

## Notes

- The project starts with demonstration records so the dashboard is not empty on first launch. You can edit or delete these examples.
- SQLite is a good fit for a local school project or prototype. For a multi-user production application, use a managed database and secure the API with authentication and authorization.
- The sample project does not include login, role management, or a public upload service. The Content Studio is intended as a simple portfolio demonstration of CRUD and ORM integration.
