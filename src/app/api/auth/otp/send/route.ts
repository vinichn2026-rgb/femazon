import { NextResponse } from 'next/server';
import { generateOtp, storeOtp, createOtpChallenge, sendOtpSms } from '@/lib/sms';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, email, name } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number or email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.trim().toLowerCase() : null;
    const primaryId = cleanEmail || cleanPhone!;
    const otp = generateOtp();

    // Store in-memory for BOTH email and phone if provided
    if (cleanEmail) storeOtp(cleanEmail, otp);
    if (cleanPhone) storeOtp(cleanPhone, otp);

    // Create serverless-safe HMAC challenge
    const challenge = createOtpChallenge(primaryId, otp);

    console.log(`[OTP Request] Generating OTP for identifier: ${primaryId}`);

    // Dispatch via SMS if phone
    if (cleanPhone) {
      await sendOtpSms({ phone: cleanPhone, otp });
    }

    // Dispatch via Google Apps Script if email
    if (cleanEmail) {
      const emailResult = await sendOtpEmail({ to: cleanEmail, name, otp });
      if (!emailResult.success) {
        console.error('Failed to send OTP email:', emailResult.error);
      }
    }

    const res = NextResponse.json({
      success: true,
      message: 'OTP sent successfully ✓',
      identifier: primaryId
    });

    // Set serverless challenge cookie
    res.cookies.set('femazon_otp_challenge', challenge, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
      secure: process.env.NODE_ENV === 'production'
    });

    return res;
  } catch (error) {
    console.error('[OTP Send Error]', error);
    return NextResponse.json(
      { success: false, message: 'Unable to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
