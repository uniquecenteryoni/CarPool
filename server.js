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

function ridePayload(ride) {
  return {
    id: ride.id,
    driver: ride.driver,
    phone: ride.phone,
    tripType: ride.trip_type,
    airport: ride.airport,
    date: ride.date,
    time: ride.time,
    dest: ride.dest,
    seats: ride.seats,
    trunkSpace: ride.trunk_space === 1,
    dogsAllowed: ride.dogs_allowed === 1,
    price: ride.price,
    uid: ride.uid || '',
    driverAvatar: ride.driver_avatar || '',
  }
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '')
}

async function hashOtp(code) {
  const raw = new TextEncoder().encode(String(code))
  const digest = await crypto.subtle.digest('SHA-256', raw)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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
          'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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

    if (pathname === '/api/driver/send-code' && req.method === 'POST') {
      try {
        const body = await req.json()
        const phone = normalizePhone(body?.phone)

        if (!phone || phone.length < 8) {
          return json({ ok: false, error: 'Phone is required.' }, 400)
        }

        const now = Date.now()
        const existing = db.prepare('SELECT * FROM driver_otp_codes WHERE phone = ? LIMIT 1').get(phone)
        if (existing && now - Number(existing.last_sent_at || 0) < 60_000) {
          return json({ ok: false, error: 'Please wait before requesting a new code.' }, 429)
        }

        const code = generateOtpCode()
        const codeHash = await hashOtp(code)
        const expiresAt = now + 5 * 60_000

        db.prepare(`
          INSERT INTO driver_otp_codes (phone, code_hash, expires_at, attempts, verified_until, last_sent_at)
          VALUES (?, ?, ?, 0, 0, ?)
          ON CONFLICT(phone) DO UPDATE SET
            code_hash = excluded.code_hash,
            expires_at = excluded.expires_at,
            attempts = 0,
            verified_until = 0,
            last_sent_at = excluded.last_sent_at
        `).run(phone, codeHash, expiresAt, now)

        return json({
          ok: true,
          message: 'OTP code created. Connect SMS provider to deliver it.',
          devCode: code,
          expiresInSeconds: 300,
        })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/driver/verify-code' && req.method === 'POST') {
      try {
        const body = await req.json()
        const phone = normalizePhone(body?.phone)
        const code = String(body?.code || '').trim()

        if (!phone || !code) {
          return json({ ok: false, error: 'phone and code are required.' }, 400)
        }

        const row = db.prepare('SELECT * FROM driver_otp_codes WHERE phone = ? LIMIT 1').get(phone)
        if (!row) {
          return json({ ok: false, error: 'No verification request found.' }, 404)
        }

        const now = Date.now()
        if (now > Number(row.expires_at)) {
          return json({ ok: false, error: 'Code expired. Please request a new code.' }, 410)
        }

        if (Number(row.attempts) >= 5) {
          return json({ ok: false, error: 'Too many attempts. Request a new code.' }, 429)
        }

        const codeHash = await hashOtp(code)
        if (codeHash !== row.code_hash) {
          db.prepare('UPDATE driver_otp_codes SET attempts = attempts + 1 WHERE phone = ?').run(phone)
          return json({ ok: false, error: 'Invalid code.' }, 401)
        }

        const verifiedUntil = now + 7 * 24 * 60 * 60_000
        db.prepare('UPDATE driver_otp_codes SET verified_until = ?, attempts = 0 WHERE phone = ?').run(verifiedUntil, phone)
        return json({ ok: true, verifiedUntil, ttlSeconds: 7 * 24 * 60 * 60 })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/rides' && req.method === 'GET') {
      const tripType = (url.searchParams.get('tripType') || '').trim()
      const airport = (url.searchParams.get('airport') || '').trim()
      const date = (url.searchParams.get('date') || '').trim()
      const time = (url.searchParams.get('time') || '').trim()

      if (!tripType || !airport || !date) {
        return json({ ok: false, error: 'tripType, airport, and date are required.' }, 400)
      }

      let rides = db
        .prepare('SELECT * FROM rides WHERE trip_type = ? AND airport = ? AND date = ? ORDER BY date ASC, time ASC, id DESC')
        .all(tripType, airport, date)

      if (time) {
        const [hh, mm] = String(time).split(':').map(Number)
        const selectedMinutes = hh * 60 + mm
        rides = rides.filter((ride) => {
          const [rh, rm] = String(ride.time || '00:00').split(':').map(Number)
          const rideMinutes = rh * 60 + rm
          return Math.abs(rideMinutes - selectedMinutes) <= 180
        })
      }

      return json({ ok: true, rides: rides.map(ridePayload) })
    }

    if (pathname === '/api/rides' && req.method === 'POST') {
      try {
        const body = await req.json()
        const phone = normalizePhone(body?.phone)

        const required = ['driver', 'tripType', 'airport', 'date', 'time', 'dest']
        for (const field of required) {
          if (!String(body?.[field] ?? '').trim()) {
            return json({ ok: false, error: `${field} is required.` }, 400)
          }
        }

        if (!phone) {
          return json({ ok: false, error: 'phone is required.' }, 400)
        }

        const otpRow = db.prepare('SELECT verified_until FROM driver_otp_codes WHERE phone = ? LIMIT 1').get(phone)
        if (!otpRow || Date.now() > Number(otpRow.verified_until || 0)) {
          return json({ ok: false, error: 'Driver phone must be OTP verified before publishing.' }, 401)
        }

        const seats = Number(body?.seats || 0)
        const price = Number(body?.price || 0)
        const trunkSpace = body?.trunkSpace ? 1 : 0
        const dogsAllowed = body?.dogsAllowed ? 1 : 0

        const result = db.prepare(`
          INSERT INTO rides (
            driver, phone, trip_type, airport, date, time, dest,
            seats, trunk_space, dogs_allowed, price, uid, driver_avatar, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          String(body.driver).trim(),
          phone,
          String(body.tripType).trim(),
          String(body.airport).trim(),
          String(body.date).trim(),
          String(body.time).trim(),
          String(body.dest).trim(),
          seats,
          trunkSpace,
          dogsAllowed,
          price,
          String(body?.uid || '').trim(),
          String(body?.driverAvatar || ''),
          Date.now(),
        )

        const ride = db.prepare('SELECT * FROM rides WHERE id = ? LIMIT 1').get(result.lastInsertRowid)
        return json({ ok: true, ride: ridePayload(ride) }, 201)
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    if (pathname === '/api/rides/mine' && req.method === 'GET') {
      const phone = normalizePhone(url.searchParams.get('phone'))
      if (!phone) {
        return json({ ok: false, error: 'phone is required.' }, 400)
      }

      const rides = db
        .prepare('SELECT * FROM rides WHERE phone = ? ORDER BY created_at DESC, id DESC')
        .all(phone)

      return json({ ok: true, rides: rides.map(ridePayload) })
    }

    if (pathname.startsWith('/api/rides/') && req.method === 'PUT') {
      try {
        const rideId = Number(pathname.split('/').pop())
        if (!Number.isFinite(rideId) || rideId <= 0) {
          return json({ ok: false, error: 'Invalid ride id.' }, 400)
        }

        const body = await req.json()
        const phone = normalizePhone(body?.phone)
        if (!phone) {
          return json({ ok: false, error: 'phone is required.' }, 400)
        }

        const existing = db.prepare('SELECT * FROM rides WHERE id = ? LIMIT 1').get(rideId)
        if (!existing) {
          return json({ ok: false, error: 'Ride not found.' }, 404)
        }
        if (normalizePhone(existing.phone) !== phone) {
          return json({ ok: false, error: 'Not allowed to edit this ride.' }, 403)
        }

        const nextTime = String(body?.time || existing.time).trim()
        const nextPrice = Number.isFinite(Number(body?.price)) ? Number(body.price) : Number(existing.price || 0)
        const nextSeats = Number.isFinite(Number(body?.seats)) ? Number(body.seats) : Number(existing.seats || 1)

        db.prepare('UPDATE rides SET time = ?, price = ?, seats = ? WHERE id = ?').run(nextTime, nextPrice, nextSeats, rideId)
        const updated = db.prepare('SELECT * FROM rides WHERE id = ? LIMIT 1').get(rideId)
        return json({ ok: true, ride: ridePayload(updated) })
      } catch {
        return json({ ok: false, error: 'Invalid request payload.' }, 400)
      }
    }

    return json({ ok: false, error: 'Not found' }, 404)
  },
})

console.log('Bun API running on http://localhost:3001')
console.log('Seeded admin user -> username: admin, password: 1234')
