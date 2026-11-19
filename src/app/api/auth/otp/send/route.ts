import { NextResponse } from 'next/server';
import { generateOtp, storeOtp, createOtpChallenge, sendOtpSms, checkRateLimit } from '@/lib/sms';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { phone, email, name } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number or email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPhone = phone ? String(phone).trim().toLowerCase() : null;
    const primaryId = cleanEmail || cleanPhone!;

    // 1. Enforce 30-second rate limiting cooldown
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/femazon_otp_challenge=([^;]+)/);
    const existingChallenge = match ? decodeURIComponent(match[1]) : undefined;

    const rateCheck = checkRateLimit(primaryId, existingChallenge);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Please wait ${rateCheck.remainingSecs || 30} seconds before requesting a new verification code.` 
        },
        { status: 429 }
      );
    }

    // 2. Generate secure 6-digit random OTP
    const otp = generateOtp();

    // 3. Store hashed OTP in server-side memory
    if (cleanEmail) storeOtp(cleanEmail, otp);
    if (cleanPhone) storeOtp(cleanPhone, otp);

    // 4. Create signed, serverless-safe HMAC challenge
    const challenge = createOtpChallenge(primaryId, otp);

    // 5. Dispatch via SMS if phone
    if (cleanPhone) {
      await sendOtpSms({ phone: cleanPhone, otp });
    }

    // 6. Dispatch via Transactional Email service if email
    if (cleanEmail) {
      const emailResult = await sendOtpEmail({ to: cleanEmail, name, otp });
      if (!emailResult.success) {
        let errMsg = emailResult.error || 'Unable to deliver verification email.';
        if (typeof errMsg === 'string' && (errMsg.includes('<') || errMsg.includes('Access Denied') || errMsg.includes('html'))) {
          errMsg = 'Google Apps Script Access Denied: In Google Apps Script, click Deploy > Manage deployments > Edit > set "Who has access" to "Anyone" and redeploy. Alternatively, configure RESEND_API_KEY in Vercel.';
        }
        console.error('[OTP Email Dispatch Error]:', errMsg);
        return NextResponse.json(
          { 
            success: false, 
            message: errMsg 
          },
          { status: 502 }
        );
      }
    }

    const isHttps = request.url.startsWith('https://') || request.headers.get('x-forwarded-proto') === 'https';

    const res = NextResponse.json({
      success: true,
      message: 'Verification code sent successfully ✓',
      identifier: primaryId
    });

    // 7. Set secure serverless challenge cookie (5-minute TTL)
    res.cookies.set('femazon_otp_challenge', challenge, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 300, // 5 minutes
      secure: isHttps
    });

    return res;
  } catch (error: any) {
    console.error('[OTP Send Exception]:', error?.message || error);
    return NextResponse.json(
      { success: false, message: 'Unable to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
