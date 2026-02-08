# Volontera – tehnička dokumentacija (sažetak) + kako pokrenuti projekt

Volontera je organizirana kao **monorepo (Turborepo)** kako bi se dijelili tipovi, validacija i zajednička logika između frontenda i backenda.

## 1) Struktura projekta

### Apps

- `apps/web` – **frontend** (Next.js, App Router): stranice, komponente, feature moduli i integracija s API-jem.
- `apps/api` – **backend** (Express + Socket.IO): rute, poslovna logika, pristup bazi i integracije (e-mail, upload, plaćanja, AI).

U `apps/api/src` glavni folderi:

- `routes/`, `controllers/`, `services/`, `models/`, `middleware/`, `ws/`, `lib/`, `jobs/`

U `apps/web` glavni folderi:

- `app/`, `modules/`, `components/`, `hooks/`, `lib/`, `styles/`

### Packages (zajednički moduli)

- `packages/database` – Prisma (schema/migrations/generate) + shared DB client/tipovi
- `packages/schemas` – Zod sheme + tipovi
- `packages/permissons` – Permission logika
- `packages/types` – zajednički TypeScript tipovi (API response strukture)
- `packages/transactional` – e-mail predlošci (React Email)
- `packages/eslint-config`, `packages/typescript-config` – konfiguracije alata

## 2) Ključne značajke (sažetak)

- Registracija + OTP verifikacija e-mailom
- Onboarding: odabir tipa računa (USER/ORGANIZATION) + dodatne informacije
- Home feed: infinite scroll objave + like/dislike + komentari + reply
- Direct Messages: real-time privatni chat
- Organizacije: kreiranje, zahtjevi za pridruživanje (motivacijsko pismo), upravljanje članovima i rolama
- Objave unutar organizacije: CRUD (admin/organizator), razvrstavanje (popularno/najnovije/najstarije)
- Group chat unutar organizacije (real-time)
- Zadatci (Kanban): boardovi i taskovi, assign članova; AI dostupno Pro korisnicima
- Postavke profila + brisanje računa
- Pomoć: AI chatbot
- Javni profil + notifikacije
- Mobilna responzivnost

## 3) `.env` predlošci

Predlošci su u (stavite svoje .env varijable):

- `apps/api/.env.template`
- `apps/web/.env.template`
- `packages/database/.env.template`

## 4) Instalacija

Preduvjeti:

- Node.js (pogledati točnu verziju u .nvmrc fileu)
- Yarn 1.x
- PostgreSQL i Redis

Instalacija dependenicja (iz root direktorija):

- `yarn`

## 5) Pokretanje

### Development (samo web + api)

- `yarn dev:apps`

### Build način (samo web + api)

Ovu naredbu pokreći **iz root direktorija** (ne iz `apps/*`) kako bi se koristio turbo filter i izbjeglo ručno pokretanje buildova po aplikacijama.

- `yarn build:apps`

### Nakon toga

Backend (API):

- `cd apps/api`
- `yarn start`

Frontend (Web):

- `cd apps/web`
- `yarn start`

## 6) Baza (Prisma)

Najčešće komande:

- `yarn workspace @repo/database db:generate`
- `yarn workspace @repo/database db:seed`
