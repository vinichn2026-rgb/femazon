import { NextResponse } from 'next/server';
import { generateOtp, storeOtp, sendOtpSms } from '@/lib/sms';
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

    const otp = generateOtp();

    // Store OTP for phone identifier
    if (phone) {
      storeOtp(phone, otp);
      await sendOtpSms({ phone, otp });
    }

    // Store OTP for email identifier
    if (email) {
      storeOtp(email, otp);
      await sendOtpEmail({ to: email, name, otp });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully ✓',
      identifier: email || phone
    });
  } catch (error) {
    console.error('[OTP Send Error]', error);
    return NextResponse.json(
      { success: false, message: 'Unable to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
