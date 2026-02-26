/* global Bun */

import { Database } from 'bun:sqlite'

const DB_PATH = './data/admin.sqlite'

const db = new Database(DB_PATH, { create: true })

const CYPRUS_PLACES = [...new Set([
  'Nicosia (Lefkosia)',
  'Limassol (Lemesos)',
  'Larnaca',
  'Paphos',
  'Famagusta (Ammochostos)',
  'Kyrenia (Girne)',
  'Ayia Napa',
  'Protaras',
  'Paralimni',
  'Pernera',
  'Deryneia',
  'Frenaros',
  'Sotira',
  'Liopetri',
  'Avgorou',
  'Acheritou',
  'Agia Napa Marina',
  'Nicosia, Engomi',
  'Nicosia, Strovolos',
  'Nicosia, Aglandjia',
  'Nicosia, Lakatamia',
  'Nicosia, Latsia',
  'Nicosia, Geri',
  'Nicosia, Pallouriotissa',
  'Nicosia, Kaimakli',
  'Nicosia, Dasoupoli',
  'Nicosia, Acropolis',
  'Nicosia, Egkomi Makedonitissa',
  'Nicosia, Anthoupoli',
  'Nicosia, Deftera',
  'Nicosia, Astromeritis',
  'Nicosia, Peristerona',
  'Nicosia, Akaki',
  'Nicosia, Alampra',
  'Nicosia, Analiontas',
  'Nicosia, Dali',
  'Nicosia, Nisou',
  'Nicosia, Pera Chorio Nisou',
  'Nicosia, Tseri',
  'Nicosia, Klirou',
  'Nicosia, Malounta',
  'Nicosia, Kalo Chorio Orinis',
  'Nicosia, Meniko',
  'Nicosia, Mitsero',
  'Nicosia, Kokkinotrimithia',
  'Nicosia, Mammari',
  'Nicosia, Athienou',
  'Nicosia, Psimolofou',
  'Nicosia, Agrokipia',
  'Nicosia, Evrychou',
  'Nicosia, Kakopetria',
  'Nicosia, Galata',
  'Nicosia, Agios Epifanios Soleas',
  'Nicosia, Temvria',
  'Nicosia, Flasou',
  'Nicosia, Linou',
  'Nicosia, Moutoullas',
  'Nicosia, Pedoulas',
  'Nicosia, Spilia',
  'Limassol Marina',
  'Limassol Old Town',
  'Limassol, Germasogeia',
  'Limassol, Agios Athanasios',
  'Limassol, Mesa Geitonia',
  'Limassol, Neapolis',
  'Limassol, Potamos Germasogeia',
  'Limassol, Kapsalos',
  'Limassol, Zakaki',
  'Limassol, Agios Tychonas',
  'Limassol, Parekklisia',
  'Limassol, Pyrgos',
  'Limassol, Moni',
  'Limassol, Monagroulli',
  'Limassol, Pentakomo',
  'Limassol, Asgata',
  'Limassol, Kalavasos',
  'Limassol, Zygi',
  'Limassol, Erimi',
  'Limassol, Kolossi',
  'Limassol, Episkopi',
  'Limassol, Souni',
  'Limassol, Ypsonas',
  'Limassol, Fasoula',
  'Limassol, Palodeia',
  'Limassol, Trimiklini',
  'Limassol, Platres',
  'Limassol, Pera Pedi',
  'Limassol, Mandria',
  'Limassol, Omodos',
  'Limassol, Vasa Koilaniou',
  'Limassol, Koilani',
  'Limassol, Lofou',
  'Limassol, Vouni',
  'Limassol, Kilani',
  'Limassol, Agros',
  'Limassol, Pelendri',
  'Limassol, Kalo Chorio Limassol',
  'Larnaca, Mackenzie',
  'Larnaca, Finikoudes',
  'Larnaca, Oroklini',
  'Larnaca, Livadia',
  'Larnaca, Mazotos',
  'Larnaca, Kiti',
  'Larnaca, Meneou',
  'Larnaca, Dromolaxia',
  'Larnaca, Aradippou',
  'Larnaca, Voroklini',
  'Larnaca, Pyla',
  'Larnaca, Xylotymbou',
  'Larnaca, Xylofagou',
  'Larnaca, Avgorou',
  'Larnaca, Athienou',
  'Larnaca, Troulloi',
  'Larnaca, Kellia',
  'Larnaca, Kornos',
  'Larnaca, Kofinou',
  'Larnaca, Alethriko',
  'Larnaca, Anglisides',
  'Larnaca, Alaminos',
  'Larnaca, Anafotia',
  'Larnaca, Maroni',
  'Larnaca, Psematismenos',
  'Larnaca, Tochni',
  'Larnaca, Choirokoitia',
  'Larnaca, Softades',
  'Larnaca, Tersefanou',
  'Larnaca, Perivolia',
  'Larnaca, Kalokhorio',
  'Larnaca, Agios Theodoros',
  'Paphos, Universal',
  'Paphos, Kato Paphos',
  'Paphos, Emba',
  'Paphos, Chlorakas',
  'Paphos, Mandria',
  'Paphos, Peyia',
  'Paphos, Tala',
  'Paphos, Coral Bay',
  'Paphos, Yeroskipou',
  'Paphos, Kissonerga',
  'Paphos, Anarita',
  'Paphos, Kouklia',
  'Paphos, Timi',
  'Paphos, Acheleia',
  'Paphos, Agia Marinouda',
  'Paphos, Konia',
  'Paphos, Mesa Chorio',
  'Paphos, Tsada',
  'Paphos, Stroumpi',
  'Paphos, Polemi',
  'Paphos, Letymbou',
  'Paphos, Kathikas',
  'Paphos, Arodes',
  'Paphos, Drouseia',
  'Paphos, Polis Chrysochous',
  'Paphos, Latchi',
  'Paphos, Neo Chorio',
  'Paphos, Argaka',
  'Paphos, Pomos',
  'Paphos, Chrysochou',
  'Paphos, Goudi',
  'Paphos, Skoulli',
  'Paphos, Giolou',
  'Paphos, Mesogi',
  'Paphos, Marathounta',
  'Paphos, Panagia',
  'Paphos, Lysos',
  'Paphos, Kritou Terra',
  'Paphos, Miliou',
  'Paphos, Fyti',
  'Paphos, Choulou',
  'Paphos, Nata',
  'Paphos, Amargeti',
  'Paphos, Episkopi Pafou',
  'Paphos, Agia Varvara',
  'Paphos, Axylou',
  'Paphos, Inia',
  'Famagusta, Ayia Napa',
  'Famagusta, Protaras',
  'Famagusta, Paralimni',
  'Famagusta, Deryneia',
  'Famagusta, Sotira',
  'Famagusta, Frenaros',
  'Famagusta, Liopetri',
  'Kyrenia, Lapithos',
  'Kyrenia, Karavas',
  'Kyrenia, Bellapais',
  'Kyrenia, Catalkoy',
  'Kyrenia, Esentepe',
  'Troodos',
  'Platres',
  'Kakopetria',
  'Omodos',
  'Pano Lefkara',
  'Kato Lefkara',
  'Zygi',
  'Khirokitia',
  'Kalavasos',
  'Polis Chrysochous',
  'Latchi',
  'Prodromi',
  'Lyso',
  'Mandria',
  'Geroskipou',
  'Souni',
  'Episkopi',
  'Erimi',
  'Kolossi',
  'Parekklisia',
  'Pyrgos',
  'Tochni',
  'Vouni',
  'Agros',
  'Pelendri',
  'Agios Mamas',
  'Kouklia',
  'Koilani',
  'Moni',
  'Alaminos',
  'Kofinou',
  'Softades',
])]

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    avatar_data_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`)

function ensureUserColumn(name, definition) {
  const cols = db.prepare('PRAGMA table_info(users)').all()
  const exists = cols.some((col) => col.name === name)
  if (!exists) {
    db.exec(`ALTER TABLE users ADD COLUMN ${name} ${definition}`)
  }
}

ensureUserColumn('full_name', 'TEXT')
ensureUserColumn('phone', 'TEXT')
ensureUserColumn('address', 'TEXT')
ensureUserColumn('avatar_data_url', 'TEXT')
ensureUserColumn('created_at', 'TEXT')

const insertPlace = db.prepare('INSERT OR IGNORE INTO places (name) VALUES (?)')
const insertManyPlaces = db.transaction((places) => {
  for (const place of places) {
    insertPlace.run(place)
  }
})
insertManyPlaces(CYPRUS_PLACES)

const seedAdmin = db.prepare(`
  INSERT OR IGNORE INTO users (username, password, full_name, phone, address)
  VALUES (?, ?, ?, ?, ?)
`)
seedAdmin.run('admin', '1234', 'Admin', '0500000000', 'Paphos, Universal')

function userPayload(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    name: user.full_name || user.username,
    phone: user.phone || '',
    address: user.address || '',
    avatarDataUrl: user.avatar_data_url || '',
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url)
    const { pathname } = url

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (pathname === '/api/health' && req.method === 'GET') {
      return json({ ok: true })
    }

    if (pathname === '/api/places' && req.method === 'GET') {
      const q = (url.searchParams.get('query') || '').trim().toLowerCase()
      if (!q) {
        return json({ ok: true, places: [] })
      }

      const places = db
        .prepare(
          'SELECT name FROM places WHERE LOWER(name) LIKE ? ORDER BY name LIMIT 8',
        )
        .all(`%${q}%`)
        .map((p) => p.name)

      return json({ ok: true, places })
    }

    if (pathname === '/api/register' && req.method === 'POST') {
      try {
        const body = await req.json()
        const username = (body?.username || '').trim()
        const password = body?.password || ''
        const name = (body?.name || '').trim()
        const phone = (body?.phone || '').trim()
        const address = (body?.address || '').trim()

        if (!username || !password || !phone || !address) {
          return json({ ok: false, error: 'Missing required fields.' }, 400)
        }

        if (password.length < 6) {
          return json({ ok: false, error: 'Password must be at least 6 characters.' }, 400)
        }

        try {
          db.prepare(
            'INSERT INTO users (username, password, full_name, phone, address) VALUES (?, ?, ?, ?, ?)',
          ).run(username, password, name || username, phone, address)
        } catch {
          return json({ ok: false, error: 'Username already exists.' }, 409)
        }

        const createdUser = db
          .prepare('SELECT * FROM users WHERE username = ? LIMIT 1')
          .get(username)

        return json({ ok: true, user: userPayload(createdUser) }, 201)
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/login' && req.method === 'POST') {
      try {
        const body = await req.json()
        const { username, password } = body ?? {}

        if (!username || !password) {
          return json({ ok: false, error: 'Username and password are required.' }, 400)
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1').get(username, password)

        if (!user) {
          return json({ ok: false, error: 'Invalid credentials.' }, 401)
        }

        return json({ ok: true, user: userPayload(user) })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/user' && req.method === 'GET') {
      const username = (url.searchParams.get('username') || '').trim()
      if (!username) {
        return json({ ok: false, error: 'username is required.' }, 400)
      }

      const user = db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(username)
      if (!user) {
        return json({ ok: false, error: 'User not found.' }, 404)
      }

      return json({ ok: true, user: userPayload(user) })
    }

    if (pathname === '/api/user/address' && req.method === 'POST') {
      try {
        const body = await req.json()
        const username = (body?.username || '').trim()
        const address = (body?.address || '').trim()

        if (!username || !address) {
          return json({ ok: false, error: 'username and address are required.' }, 400)
        }

        const result = db
          .prepare('UPDATE users SET address = ? WHERE username = ?')
          .run(address, username)

        if (!result.changes) {
          return json({ ok: false, error: 'User not found.' }, 404)
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(username)
        return json({ ok: true, user: userPayload(user) })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/user/avatar' && req.method === 'POST') {
      try {
        const body = await req.json()
        const username = (body?.username || '').trim()
        const avatarDataUrl = body?.avatarDataUrl || ''

        if (!username || !avatarDataUrl) {
          return json({ ok: false, error: 'username and avatarDataUrl are required.' }, 400)
        }

        if (!avatarDataUrl.startsWith('data:image/')) {
          return json({ ok: false, error: 'Invalid image format.' }, 400)
        }

        if (avatarDataUrl.length > 2_000_000) {
          return json({ ok: false, error: 'Image is too large.' }, 413)
        }

        const result = db
          .prepare('UPDATE users SET avatar_data_url = ? WHERE username = ?')
          .run(avatarDataUrl, username)

        if (!result.changes) {
          return json({ ok: false, error: 'User not found.' }, 404)
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(username)
        return json({ ok: true, user: userPayload(user) })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    return json({ ok: false, error: 'Not found' }, 404)
  },
})

console.log('Bun API running on http://localhost:3001')
console.log('Seeded admin user -> username: admin, password: 1234')
