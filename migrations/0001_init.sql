CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_data_url TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  driver TEXT NOT NULL,
  phone TEXT NOT NULL,
  trip_type TEXT NOT NULL,
  airport TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  dest TEXT NOT NULL,
  seats INTEGER NOT NULL,
  trunk_space INTEGER NOT NULL DEFAULT 0,
  dogs_allowed INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  uid TEXT,
  driver_avatar TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS driver_otp_codes (
  phone TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  verified_until INTEGER NOT NULL DEFAULT 0,
  last_sent_at INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO users (username, password, full_name, phone, address, created_at)
VALUES ('admin', '1234', 'Admin', '0500000000', 'Paphos, Universal', CAST(strftime('%s','now') AS INTEGER) * 1000);

INSERT OR IGNORE INTO places (name) VALUES
  ('Paphos, Universal'),
  ('Paphos, Kato Paphos'),
  ('Larnaca, Finikoudes'),
  ('Larnaca, Mackenzie'),
  ('Limassol, Germasogeia'),
  ('Nicosia, Strovolos'),
  ('Ayia Napa'),
  ('Protaras'),
  ('פאפוס, יוניברסל'),
  ('לרנקה, פיניקודס'),
  ('לימסול, גרמסוגיה'),
  ('ניקוסיה, סטרובולוס');