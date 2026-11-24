export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'coagpt_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return res.redirect(303, '/login?uitgelogd=1');
}
