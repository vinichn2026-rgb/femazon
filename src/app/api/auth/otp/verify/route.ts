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

    // Check if user exists in database or create user
    const userEmail = email || (phone ? `${phone}@femazon.luxury` : `member_${Date.now()}@femazon.luxury`);
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      try {
        const dummyPassword = await import('bcryptjs').then(b => b.hash('Femazon@123', 10));
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: email ? email.split('@')[0] : 'Femazon Member',
            phone: phone || null,
            role: 'CUSTOMER',
            password: dummyPassword,
          }
        });
      } catch (e) {
        user = await prisma.user.findUnique({ where: { email: userEmail } });
      }
    }

    // Set signed cookie if user is found
    const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60 * 24 * 7; // 7 days

    const sessionPayload = {
      sub: user ? String(user.id) : `user_${Date.now()}`,
      name: user?.name || (email ? email.split('@')[0] : 'Femazon Member'),
      email: user?.email || userEmail,
      role: user?.role || 'CUSTOMER',
      iat: now,
      exp: now + expiresIn,
    };

    const token = signToken(sessionPayload, secret);
    const isProd = process.env.NODE_ENV === 'production';

    const cookieParts = [
      `femazon_session=${token}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${expiresIn}`,
    ];
    if (isProd) cookieParts.push('Secure');

    const res = NextResponse.json({
      success: true,
      message: 'Account verified successfully ✓',
      user: {
        id: sessionPayload.sub,
        name: sessionPayload.name,
        email: sessionPayload.email,
        role: sessionPayload.role,
      }
    });

    res.headers.append('Set-Cookie', cookieParts.join('; '));
    return res;
  } catch (error) {
    console.error('[OTP Verify Error]', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
