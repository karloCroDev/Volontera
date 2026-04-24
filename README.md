# Volontera – Technical Documentation (Summary) + How to Start the Project

Volontera is organized as a **monorepo (Turborepo)** to share types, validation, and common logic between frontend and backend.

## 1) Project Structure

### Apps

- `apps/web` – **frontend** (Next.js, App Router): pages, components, feature modules, and API integration.
- `apps/api` – **backend** (Express + Socket.IO): routes, business logic, database access, and integrations (email, upload, payments, AI).

Main folders in `apps/api/src`:

- `routes/`, `controllers/`, `services/`, `models/`, `middleware/`, `ws/`, `lib/`, `jobs/`

Main folders in `apps/web`:

- `app/`, `modules/`, `components/`, `hooks/`, `lib/`, `styles/`

### Packages (Shared Modules)

- `packages/database` – Prisma (schema/migrations/generate) + shared DB client/types
- `packages/schemas` – Zod schemas + types
- `packages/permissons` – Permission logic
- `packages/types` – shared TypeScript types (API response structures)
- `packages/transactional` – email templates (React Email)
- `packages/eslint-config`, `packages/typescript-config` – tool configurations

## 2) Key Features (Summary)

- Registration + OTP email verification
- Onboarding: account type selection (USER/ORGANIZATION) + additional information
- Home feed: infinite scroll posts + like/dislike + comments + replies
- Direct Messages: real-time private chat
- Organizations: creation, join requests (motivation letter), member and role management
- Posts within organization: CRUD (admin/organizer), sorting (popular/newest/oldest)
- Group chat within organization (real-time)
- Tasks (Kanban): boards and tasks, member assignment; AI available for Pro users
- Profile settings + account deletion
- Help: AI chatbot
- Public profile + notifications
- Mobile responsiveness

## 3) `.env` Templates

Templates are located in (add your own .env variables):

- `apps/api/.env.template`
- `apps/web/.env.template`
- `packages/database/.env.template`

## 4) Installation

Prerequisites:

- Node.js (check exact version in `.nvmrc` file)
- Yarn 1.x
- PostgreSQL and Redis
- Stripe CLI

Install **all** dependencies (run from root directory):

```bash
yarn
```

## 5) Running the Project

### Development (web + api only)

```bash
yarn dev:apps
```

### Build mode (web + api only)

Run this command **from the root directory** (not from `apps/*`) to use turbo filter and avoid manually running builds per application.

```bash
yarn build:apps
```

### After that

Backend (API):

- `cd apps/api` (create two terminals like this)
- Terminal 1: `yarn start`
- Terminal 2: `stripe listen --forward-to http://localhost:API_PORT/payment/webhook`

Frontend (Web):

- `cd apps/web`
- `yarn start`

## 6) Database (Prisma)

Most common commands:

```bash
yarn workspace @repo/database db:generate
yarn workspace @repo/database db:seed
```

## 7) Note (Experimental)

> ⚠️ **Docker is currently not fully integrated properly. Do not run the application via Docker.**
