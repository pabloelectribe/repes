// Utilidades compartidas de la conexión con Strava (los archivos con _ no son rutas).
const crypto = require('crypto');

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const configured = () => Boolean(CLIENT_ID && CLIENT_SECRET);

function cookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function setCookie(res, name, value, maxAge) {
  const prev = res.getHeader('Set-Cookie') || [];
  const c = `${name}=${encodeURIComponent(value)}; Path=/api/strava; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
  res.setHeader('Set-Cookie', [].concat(prev, c));
}
const origin = req => `https://${req.headers['x-forwarded-host'] || req.headers.host}`;

// La sesión vive en una cookie HttpOnly: no hay base de datos.
function readSession(req) {
  try { return JSON.parse(Buffer.from(cookies(req).strava || '', 'base64url').toString()); } catch { return null; }
}
function writeSession(res, t) {
  const s = { a: t.access_token, r: t.refresh_token, e: t.expires_at };
  setCookie(res, 'strava', Buffer.from(JSON.stringify(s)).toString('base64url'), 60 * 60 * 24 * 365);
  return s;
}
const clearSession = res => setCookie(res, 'strava', '', 0);

async function tokenRequest(params) {
  const r = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...params }),
  });
  if (!r.ok) throw new Error('strava token ' + r.status);
  return r.json();
}
const newState = () => crypto.randomBytes(16).toString('hex');

module.exports = { CLIENT_ID, configured, cookies, setCookie, origin, readSession, writeSession, clearSession, tokenRequest, newState };
