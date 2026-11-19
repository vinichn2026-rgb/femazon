import { verifyToken } from './session';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';
import { cookies } from 'next/headers';

export function getSessionFromCookie(cookieHeader?: string) {
  if (!cookieHeader) return null;
  const cookiesList = cookieHeader.split(';').map((c) => c.trim());
  const pair = cookiesList.find((c) => c.startsWith('femazon_session='));
  if (!pair) return null;
  const token = pair.split('=')[1];
  if (!token) return null;
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const payload = verifyToken(token, secret);
  return payload;
}

export async function getServerAuthEmail(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    if (sessionCookie) {
      const payload = getSessionFromCookie(`femazon_session=${sessionCookie}`);
      if (payload?.email) return payload.email;
    }

    const hasNextAuth = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token');
    if (hasNextAuth) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) return session.user.email;
    }
  } catch {}

  return null;
}

export async function getServerAuthPayload() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    if (sessionCookie) {
      const payload = getSessionFromCookie(`femazon_session=${sessionCookie}`);
      if (payload?.email) return payload;
    }

    const hasNextAuth = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token');
    if (hasNextAuth) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        return {
          sub: (session.user as any).id || session.user.email,
          email: session.user.email,
          name: session.user.name || undefined,
          role: (session.user as any).role || 'CUSTOMER',
        };
      }
    }
  } catch {}

  return null;
}

export async function getApiAuthEmail(request?: Request): Promise<string | null> {
  // 1. Try reading femazon_session from request cookie header
  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const payload = getSessionFromCookie(cookieHeader);
    if (payload?.email) return payload.email;
  }

  // 2. Try reading from next/headers cookies()
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    if (sessionCookie) {
      const payload = getSessionFromCookie(`femazon_session=${sessionCookie}`);
      if (payload?.email) return payload.email;
    }
  } catch {}

  // 3. Try reading NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) return session.user.email;
  } catch {}

  return null;
}

export async function getApiAuthPayload(request?: Request) {
  // 1. Try NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      return {
        sub: (session.user as any).id || session.user.email,
        email: session.user.email,
        name: session.user.name || undefined,
        role: (session.user as any).role || 'CUSTOMER',
      };
    }
  } catch {}

  // 2. Try request cookie header
  if (request) {
    try {
      const cookieHeader = request.headers.get('cookie') || '';
      const payload = getSessionFromCookie(cookieHeader);
      if (payload?.email) return payload;
    } catch {}
  }

  // 3. Try next/headers cookies()
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    if (sessionCookie) {
      const payload = getSessionFromCookie(`femazon_session=${sessionCookie}`);
      if (payload?.email) return payload;
    }
  } catch {}

  return null;
}
