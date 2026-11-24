// Beschermt het hele prototype achter een inlog.
// Zonder geldige sessie-cookie ga je naar /login.
import { next } from '@vercel/functions';

export const config = {
  matcher: ['/((?!login|api/login|favicon\\.ico).*)'],
};

const COOKIE = 'coagpt_session';

async function hmacHex(value, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const secret = process.env.AUTH_SECRET;
  const match = (request.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));

  if (secret && match) {
    const [exp, sig] = decodeURIComponent(match[1]).split('.');
    if (exp && sig && Number(exp) > Date.now() && safeEqual(sig, await hmacHex(exp, secret))) {
      return next();
    }
  }

  const login = new URL('/login', url);
  if (url.pathname !== '/') login.searchParams.set('next', url.pathname);
  return Response.redirect(login, 302);
}
