import crypto from 'crypto';

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(String(input));
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function signToken(payload: object, secret: string) {
  const encoded = base64url(JSON.stringify(payload));
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encoded);
  const signature = base64url(hmac.digest());
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string, secret: string) {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(encoded);
    const expected = base64url(hmac.digest());
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}
