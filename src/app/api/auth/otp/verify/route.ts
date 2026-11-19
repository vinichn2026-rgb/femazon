import { NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/sms';
import { signToken } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, email, otp } = body;

    const identifier = phone || email;

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, message: 'Verification code and identifier are required.' },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/femazon_otp_challenge=([^;]+)/);
    const challenge = match ? decodeURIComponent(match[1]) : undefined;

    let verification = verifyOtpCode(identifier, otp, challenge);

    // If not verified and both phone and email were sent, check other identifier
    if (!verification.success && phone && email) {
      const altId = identifier === phone ? email : phone;
      const altVerification = verifyOtpCode(altId, otp, challenge);
      if (altVerification.success) {
        verification = altVerification;
      }
    }

    if (!verification.success) {
      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 400 }
      );
    }

    // Safely check if user exists in database or create user (non-blocking if DB offline)
    const userEmail = email || (phone ? `${phone}@femazon.luxury` : `member_${Date.now()}@femazon.luxury`);
    let user: any = null;
    try {
      user = await prisma.user.findUnique({ where: { email: userEmail } });

      if (!user) {
        const dummyPassword = await import('bcryptjs').then(b => b.hash('Femazon@123', 10));
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: email ? email.split('@')[0] : 'Femazon Member',
            phone: phone || null,
            role: 'CUSTOMER',
            password: dummyPassword,
          }
        }).catch(async () => {
          return await prisma.user.findUnique({ where: { email: userEmail } });
        });
      }
    } catch (dbErr) {
      console.warn('[OTP Verify Warning] DB query skipped:', dbErr);
    }

    // Set signed session token stored in an HttpOnly cookie
    const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60 * 24 * 7; // 7 days

    const sessionPayload = {
      sub: user ? String(user.id) : `user_${Date.now()}`,
      name: user?.name || (email ? email.split('@')[0] : 'Femazon Member'),
      email: user?.email || userEmail,
      phone: user?.phone || phone || '',
      role: user?.role || 'CUSTOMER',
      iat: now,
      exp: now + expiresIn,
    };

    const token = signToken(sessionPayload, secret);
    const isHttps = request.url.startsWith('https://') || request.headers.get('x-forwarded-proto') === 'https';

    const res = NextResponse.json({
      success: true,
      message: 'Account verified successfully ✓',
      user: {
        id: sessionPayload.sub,
        name: sessionPayload.name,
        email: sessionPayload.email,
        phone: sessionPayload.phone,
        role: sessionPayload.role,
      }
    });

    res.cookies.set({
      name: 'femazon_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
      secure: isHttps,
    });

    // Invalidate the challenge cookie to strictly prevent OTP reuse
    res.cookies.set({
      name: 'femazon_otp_challenge',
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      secure: isHttps,
    });

    return res;
  } catch (error) {
    console.error('[OTP Verify Error]', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
