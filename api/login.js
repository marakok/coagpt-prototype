import crypto from 'node:crypto';

const COOKIE = 'coagpt_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dagen

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const body = req.body || {};
  const password = typeof body.password === 'string' ? body.password : '';
  const next = safeNext(body.next);
  const expected = process.env.PROTOTYPE_PASSWORD || '';
  const secret = process.env.AUTH_SECRET || '';

  if (!expected || !secret) {
    return res.redirect(303, '/login?error=config');
  }

  const a = crypto.createHash('sha256').update(password).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return res.redirect(303, '/login?error=1&next=' + encodeURIComponent(next));
  }

  const exp = String(Date.now() + MAX_AGE * 1000);
  const sig = crypto.createHmac('sha256', secret).update(exp).digest('hex');
  res.setHeader('Set-Cookie', `${COOKIE}=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`);
  return res.redirect(303, next);
}
