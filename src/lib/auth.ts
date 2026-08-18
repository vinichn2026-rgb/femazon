import { verifyToken } from './session';

export function getSessionFromCookie(cookieHeader?: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const pair = cookies.find((c) => c.startsWith('femazon_session='));
  if (!pair) return null;
  const token = pair.split('=')[1];
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const payload = verifyToken(token, secret);
  return payload;
}
