# CarPool (Cyprus Rides)

Production-ready direction for this project:

- Frontend: static `index.html` (Vite serves/builds it)
- Local backend: Bun + SQLite (`server.js` + `data/admin.sqlite`)
- Cloud backend: Cloudflare Worker + D1 (`worker.js` + `migrations/`)
- Driver publishing gate: OTP (one-time code) before publishing ride

## Local development

### 1) Install dependencies

```bash
bun install
```

### 2) Run local API (Bun)

```bash
bun run dev:server
```

Local API URL: http://localhost:3001

### 3) Run frontend

```bash
bun run dev
```

Frontend URL: http://localhost:5173

> Vite proxies `/api` to the local Bun API.

## What is already implemented

- Shared rides API (`GET /api/rides`, `POST /api/rides`)
- Driver OTP endpoints (`POST /api/driver/send-code`, `POST /api/driver/verify-code`)
- Existing user/address/avatar/places APIs remain available
- Frontend ride list now loads from API (not `localStorage`)
- Publishing ride now requires OTP verification by phone

## Cloudflare deployment (Pages + Worker + D1)

### 1) Login and create D1 DB

```bash
bunx wrangler login
bunx wrangler d1 create carpool-db
```

Copy the returned `database_id` into `wrangler.toml`.

### 2) Configure `wrangler.toml`

File already exists: `wrangler.toml`

Set:

- `database_name = "carpool-db"`
- `database_id = "<YOUR_REAL_DATABASE_ID>"`

### 3) Apply D1 migration

```bash
bun run cf:d1:migrate:local
bun run cf:d1:migrate:remote
```

Migration file: `migrations/0001_init.sql`

### 4) Deploy Worker API

```bash
bun run cf:deploy
```

### 5) Deploy frontend to Cloudflare Pages

- Connect this repo in Cloudflare Pages
- Build command: `bun run build`
- Output directory: `dist`

### 6) API base in production

Current frontend uses same-origin `/api` by default, so recommended setup:

- Route Worker on same domain under `/api/*`
- Or use Pages Functions/Worker integration so requests stay same-origin

## Important manual tasks still required

1. **SMS provider integration (critical)**
	- Current OTP endpoint returns `devCode` for testing.
	- Replace with real SMS sending (Twilio/Vonage/etc).

2. **Security hardening**
	- Hash user passwords (currently plain for compatibility with existing flow)
	- Add stronger rate limiting (IP + phone)
	- Remove `devCode` response in production

3. **Cloudflare secrets**
	- Add SMS API keys via Wrangler secrets:

```bash
bunx wrangler secret put SMS_API_KEY
bunx wrangler secret put SMS_API_SECRET
```

4. **Domain routing**
	- Ensure frontend and worker API are routed correctly (`/api/*`)

## Useful scripts

- `bun run dev` – frontend
- `bun run dev:server` – local Bun API
- `bun run dev:worker` – local Worker dev server
- `bun run build` – build frontend
- `bun run cf:deploy` – deploy worker
- `bun run cf:d1:migrate:local` – apply local D1 migration
- `bun run cf:d1:migrate:remote` – apply remote D1 migration
