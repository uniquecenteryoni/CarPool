# CarPool Admin Login (Bun + React Router v7 + SQLite)

This project includes:

- React (Vite) frontend using React Router v7
- Bun backend API server
- Bun built-in SQLite database at `data/admin.sqlite`
- Seeded admin user credentials: `admin` / `1234`

## Cyprus Rides HTML app (new)

`cyprus-rides.html` is now connected to the Bun SQLite backend for:

- User registration with unique username + password
- Login against SQLite users table
- Cyprus address suggestions from DB while typing
- Profile address update saved in DB
- Profile image upload (saved as Data URL in DB and shown instead of letter avatar)

> Important: Keep the backend running while using `cyprus-rides.html`.

## 1) Install dependencies

```bash
bun install
```

## 2) Run backend (Bun API)

```bash
bun run dev:server
```

Backend URL: http://localhost:3001

## 3) Run frontend (Vite with Bun)

```bash
bun run dev
```

Frontend URL: http://localhost:5173

## Login

- Username: `admin`
- Password: `1234`
