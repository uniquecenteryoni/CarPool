const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

function toE164Phone(phone, defaultCountryCode = '+972') {
  const normalized = normalizePhone(phone);
  if (!normalized) return '';
  if (normalized.startsWith('+')) return normalized;
  if (normalized.startsWith('00')) return `+${normalized.slice(2)}`;
  if (normalized.startsWith('0')) {
    return `${defaultCountryCode}${normalized.slice(1)}`;
  }
  return `${defaultCountryCode}${normalized}`;
}

function twilioConfigured(env) {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);
}

async function sendOtpWithTwilio(env, to, code) {
  const accountSid = env.TWILIO_ACCOUNT_SID;
  const authToken = env.TWILIO_AUTH_TOKEN;
  const from = env.TWILIO_FROM_NUMBER;

  const payload = new URLSearchParams({
    To: to,
    From: from,
    Body: `קוד האימות שלך הוא: ${code}`,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    },
  );

  if (!response.ok) {
    let msg = `Twilio request failed (${response.status})`;
    try {
      const body = await response.json();
      msg = body?.message || msg;
    } catch {
      // keep fallback message
    }
    throw new Error(msg);
  }
}

async function hashOtp(code) {
  const raw = new TextEncoder().encode(String(code));
  const digest = await crypto.subtle.digest('SHA-256', raw);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function userPayload(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.full_name || user.username,
    phone: user.phone || '',
    address: user.address || '',
    avatarDataUrl: user.avatar_data_url || '',
  };
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
    trunkSpace: Number(ride.trunk_space) === 1,
    dogsAllowed: Number(ride.dogs_allowed) === 1,
    price: ride.price,
    uid: ride.uid || '',
    driverAvatar: ride.driver_avatar || '',
  };
}

async function parseJson(req) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (pathname === '/api/health' && req.method === 'GET') {
      return json({ ok: true });
    }

    if (pathname === '/api/places' && req.method === 'GET') {
      const q = (url.searchParams.get('query') || '').trim().toLowerCase();
      if (!q) return json({ ok: true, places: [] });
      const { results } = await env.DB.prepare(
        'SELECT name FROM places WHERE LOWER(name) LIKE ? ORDER BY name LIMIT 8',
      ).bind(`%${q}%`).all();
      return json({ ok: true, places: (results || []).map((p) => p.name) });
    }

    if (pathname === '/api/register' && req.method === 'POST') {
      const body = await parseJson(req);
      const username = (body?.username || '').trim();
      const password = body?.password || '';
      const name = (body?.name || '').trim();
      const phone = (body?.phone || '').trim();
      const address = (body?.address || '').trim();
      if (!username || !password || !phone || !address) {
        return json({ ok: false, error: 'Missing required fields.' }, 400);
      }
      if (password.length < 6) {
        return json({ ok: false, error: 'Password must be at least 6 characters.' }, 400);
      }

      const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ? LIMIT 1').bind(username).first();
      if (exists) {
        return json({ ok: false, error: 'Username already exists.' }, 409);
      }

      await env.DB.prepare(
        'INSERT INTO users (username, password, full_name, phone, address, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      ).bind(username, password, name || username, phone, address, Date.now()).run();

      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').bind(username).first();
      return json({ ok: true, user: userPayload(user) }, 201);
    }

    if (pathname === '/api/login' && req.method === 'POST') {
      const body = await parseJson(req);
      const username = (body?.username || '').trim();
      const password = body?.password || '';
      if (!username || !password) {
        return json({ ok: false, error: 'Username and password are required.' }, 400);
      }
      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1').bind(username, password).first();
      if (!user) {
        return json({ ok: false, error: 'Invalid credentials.' }, 401);
      }
      return json({ ok: true, user: userPayload(user) });
    }

    if (pathname === '/api/user' && req.method === 'GET') {
      const username = (url.searchParams.get('username') || '').trim();
      if (!username) return json({ ok: false, error: 'username is required.' }, 400);
      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').bind(username).first();
      if (!user) return json({ ok: false, error: 'User not found.' }, 404);
      return json({ ok: true, user: userPayload(user) });
    }

    if (pathname === '/api/user/address' && req.method === 'POST') {
      const body = await parseJson(req);
      const username = (body?.username || '').trim();
      const address = (body?.address || '').trim();
      if (!username || !address) {
        return json({ ok: false, error: 'username and address are required.' }, 400);
      }
      const result = await env.DB.prepare('UPDATE users SET address = ? WHERE username = ?').bind(address, username).run();
      if (!result.success || result.meta.changes === 0) {
        return json({ ok: false, error: 'User not found.' }, 404);
      }
      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').bind(username).first();
      return json({ ok: true, user: userPayload(user) });
    }

    if (pathname === '/api/user/avatar' && req.method === 'POST') {
      const body = await parseJson(req);
      const username = (body?.username || '').trim();
      const avatarDataUrl = body?.avatarDataUrl || '';
      if (!username || !avatarDataUrl) {
        return json({ ok: false, error: 'username and avatarDataUrl are required.' }, 400);
      }
      if (!String(avatarDataUrl).startsWith('data:image/')) {
        return json({ ok: false, error: 'Invalid image format.' }, 400);
      }
      const result = await env.DB.prepare('UPDATE users SET avatar_data_url = ? WHERE username = ?').bind(avatarDataUrl, username).run();
      if (!result.success || result.meta.changes === 0) {
        return json({ ok: false, error: 'User not found.' }, 404);
      }
      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').bind(username).first();
      return json({ ok: true, user: userPayload(user) });
    }

    if (pathname === '/api/driver/send-code' && req.method === 'POST') {
      const body = await parseJson(req);
      const phone = normalizePhone(body?.phone);
      if (!phone || phone.length < 8) {
        return json({ ok: false, error: 'Phone is required.' }, 400);
      }

      const now = Date.now();
      const existing = await env.DB.prepare('SELECT last_sent_at FROM driver_otp_codes WHERE phone = ? LIMIT 1').bind(phone).first();
      if (existing && now - Number(existing.last_sent_at || 0) < 60_000) {
        return json({ ok: false, error: 'Please wait before requesting a new code.' }, 429);
      }

      const code = generateOtpCode();
      const codeHash = await hashOtp(code);
      const expiresAt = now + 5 * 60_000;

      await env.DB.prepare(`
        INSERT INTO driver_otp_codes (phone, code_hash, expires_at, attempts, verified_until, last_sent_at)
        VALUES (?, ?, ?, 0, 0, ?)
        ON CONFLICT(phone) DO UPDATE SET
          code_hash = excluded.code_hash,
          expires_at = excluded.expires_at,
          attempts = 0,
          verified_until = 0,
          last_sent_at = excluded.last_sent_at
      `).bind(phone, codeHash, expiresAt, now).run();

      let smsSent = false;
      let provider = 'none';
      const destination = toE164Phone(phone, env.SMS_DEFAULT_COUNTRY_CODE || '+972');

      if (twilioConfigured(env)) {
        try {
          await sendOtpWithTwilio(env, destination, code);
          smsSent = true;
          provider = 'twilio';
        } catch (err) {
          return json({
            ok: false,
            error: 'Failed to send SMS code.',
            details: err.message,
          }, 502);
        }
      }

      const debugEnabled = env.OTP_DEBUG === '1';
      return json({
        ok: true,
        message: smsSent
          ? 'OTP sent by SMS.'
          : 'SMS provider not configured. Use devCode for testing.',
        smsSent,
        provider,
        to: destination,
        expiresInSeconds: 300,
        ...(debugEnabled || !smsSent ? { devCode: code } : {}),
      });
    }

    if (pathname === '/api/driver/verify-code' && req.method === 'POST') {
      const body = await parseJson(req);
      const phone = normalizePhone(body?.phone);
      const code = String(body?.code || '').trim();
      if (!phone || !code) {
        return json({ ok: false, error: 'phone and code are required.' }, 400);
      }

      const row = await env.DB.prepare('SELECT * FROM driver_otp_codes WHERE phone = ? LIMIT 1').bind(phone).first();
      if (!row) return json({ ok: false, error: 'No verification request found.' }, 404);

      const now = Date.now();
      if (now > Number(row.expires_at)) {
        return json({ ok: false, error: 'Code expired. Please request a new code.' }, 410);
      }
      if (Number(row.attempts) >= 5) {
        return json({ ok: false, error: 'Too many attempts. Request a new code.' }, 429);
      }

      const codeHash = await hashOtp(code);
      if (codeHash !== row.code_hash) {
        await env.DB.prepare('UPDATE driver_otp_codes SET attempts = attempts + 1 WHERE phone = ?').bind(phone).run();
        return json({ ok: false, error: 'Invalid code.' }, 401);
      }

      const verifiedUntil = now + 7 * 24 * 60 * 60_000;
      await env.DB.prepare('UPDATE driver_otp_codes SET verified_until = ?, attempts = 0 WHERE phone = ?').bind(verifiedUntil, phone).run();
      return json({ ok: true, verifiedUntil, ttlSeconds: 7 * 24 * 60 * 60 });
    }

    if (pathname === '/api/rides' && req.method === 'GET') {
      const tripType = (url.searchParams.get('tripType') || '').trim();
      const airport = (url.searchParams.get('airport') || '').trim();
      const date = (url.searchParams.get('date') || '').trim();
      const time = (url.searchParams.get('time') || '').trim();

      if (!tripType || !airport || !date) {
        return json({ ok: false, error: 'tripType, airport, and date are required.' }, 400);
      }

      const { results } = await env.DB.prepare(
        'SELECT * FROM rides WHERE trip_type = ? AND airport = ? AND date = ? ORDER BY date ASC, time ASC, id DESC',
      ).bind(tripType, airport, date).all();

      let rides = results || [];
      if (time) {
        const [hh, mm] = String(time).split(':').map(Number);
        const selectedMinutes = hh * 60 + mm;
        rides = rides.filter((ride) => {
          const [rh, rm] = String(ride.time || '00:00').split(':').map(Number);
          const rideMinutes = rh * 60 + rm;
          return Math.abs(rideMinutes - selectedMinutes) <= 180;
        });
      }

      return json({ ok: true, rides: rides.map(ridePayload) });
    }

    if (pathname === '/api/rides' && req.method === 'POST') {
      const body = await parseJson(req);
      const phone = normalizePhone(body?.phone);
      const required = ['driver', 'tripType', 'airport', 'date', 'time', 'dest'];
      for (const field of required) {
        if (!String(body?.[field] ?? '').trim()) {
          return json({ ok: false, error: `${field} is required.` }, 400);
        }
      }
      if (!phone) return json({ ok: false, error: 'phone is required.' }, 400);

      const otp = await env.DB.prepare('SELECT verified_until FROM driver_otp_codes WHERE phone = ? LIMIT 1').bind(phone).first();
      if (!otp || Date.now() > Number(otp.verified_until || 0)) {
        return json({ ok: false, error: 'Driver phone must be OTP verified before publishing.' }, 401);
      }

      const seats = Number(body?.seats || 0);
      const price = Number(body?.price || 0);
      const trunkSpace = body?.trunkSpace ? 1 : 0;
      const dogsAllowed = body?.dogsAllowed ? 1 : 0;
      const createdAt = Date.now();

      const inserted = await env.DB.prepare(`
        INSERT INTO rides (
          driver, phone, trip_type, airport, date, time, dest,
          seats, trunk_space, dogs_allowed, price, uid, driver_avatar, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `).bind(
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
        createdAt,
      ).first();

      return json({ ok: true, ride: ridePayload(inserted) }, 201);
    }

    if (pathname === '/api/rides/mine' && req.method === 'GET') {
      const phone = normalizePhone(url.searchParams.get('phone'));
      if (!phone) {
        return json({ ok: false, error: 'phone is required.' }, 400);
      }

      const { results } = await env.DB.prepare(
        'SELECT * FROM rides WHERE phone = ? ORDER BY created_at DESC, id DESC',
      ).bind(phone).all();

      return json({ ok: true, rides: (results || []).map(ridePayload) });
    }

    if (pathname.startsWith('/api/rides/') && req.method === 'PUT') {
      const rideId = Number(pathname.split('/').pop());
      if (!Number.isFinite(rideId) || rideId <= 0) {
        return json({ ok: false, error: 'Invalid ride id.' }, 400);
      }

      const body = await parseJson(req);
      const phone = normalizePhone(body?.phone);
      if (!phone) {
        return json({ ok: false, error: 'phone is required.' }, 400);
      }

      const existing = await env.DB.prepare('SELECT * FROM rides WHERE id = ? LIMIT 1').bind(rideId).first();
      if (!existing) {
        return json({ ok: false, error: 'Ride not found.' }, 404);
      }
      if (normalizePhone(existing.phone) !== phone) {
        return json({ ok: false, error: 'Not allowed to edit this ride.' }, 403);
      }

      const nextTime = String(body?.time || existing.time).trim();
      const nextPrice = Number.isFinite(Number(body?.price)) ? Number(body.price) : Number(existing.price || 0);
      const nextSeats = Number.isFinite(Number(body?.seats)) ? Number(body.seats) : Number(existing.seats || 1);

      await env.DB.prepare(
        'UPDATE rides SET time = ?, price = ?, seats = ? WHERE id = ?',
      ).bind(nextTime, nextPrice, nextSeats, rideId).run();

      const updated = await env.DB.prepare('SELECT * FROM rides WHERE id = ? LIMIT 1').bind(rideId).first();
      return json({ ok: true, ride: ridePayload(updated) });
    }

    return json({ ok: false, error: 'Not found' }, 404);
  },
};