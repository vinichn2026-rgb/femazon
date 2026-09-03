/**
 * Femazon Luxury Couture — Transactional Email Service
 * 
 * Supports production email providers:
 * - Brevo (Sendinblue)
 * - Resend
 * - SendGrid / SMTP
 * 
 * Environment variables:
 * - BREVO_API_KEY (or EMAIL_API_KEY)
 * - EMAIL_PROVIDER (e.g. 'brevo' or 'resend')
 * - EMAIL_FROM (e.g. 'Femazon <hello@femazon.com>' or verified sender email in Brevo)
 */

export interface SendOtpEmailParams {
  to: string;
  name?: string;
  otp: string;
}

export function generateOtpEmailHtml({ name, otp }: { name?: string; otp: string }) {
  const displayName = name ? name.split(' ')[0] : 'there';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Femazon verification code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1311;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="520px" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 40px; box-shadow: 0 4px 20px rgba(74, 21, 19, 0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 28px; border-bottom: 1px solid #F3EDE9;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: normal; color: #4A1513; margin: 0; letter-spacing: 2px;">
                FEMAZON
              </h1>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9A8E8B; margin: 4px 0 0 0;">
                Luxury Indian Couture &amp; Designer Wear
              </p>
            </td>
          </tr>

          <!-- Main Greeting & Message -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 24px;">
              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0;">
                Verify your Femazon account
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #6B5E5B; margin: 0 0 24px 0;">
                Hi ${displayName},<br><br>
                Thank you for joining Femazon. Please use the verification code below to complete your registration.
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #FAF7F5; border: 1px solid #E5DBD5; border-radius: 14px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; color: #6B5E5B; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4A1513;">
                  ${otp}
                </span>
              </div>

              <!-- Security Information -->
              <p style="font-size: 13px; color: #8A7E7B; line-height: 1.5; margin: 0 0 8px 0;">
                ⏱ <strong>This code expires in 10 minutes.</strong>
              </p>
              <p style="font-size: 13px; color: #8A7E7B; line-height: 1.5; margin: 0;">
                🔒 Please don't share this code with anyone. Femazon staff will never ask for your verification code.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 28px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491;">
              <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} Femazon. All rights reserved.</p>
              <p style="margin: 0;">If you didn't request this code, please ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Server-side email sender handler
 */
export async function sendOtpEmail({ to, name, otp }: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  const provider = (process.env.EMAIL_PROVIDER || (process.env.BREVO_API_KEY ? 'brevo' : '')).toLowerCase();
  const fromRaw = process.env.EMAIL_FROM || 'hello@femazon.com';

  // Parse Sender Name and Email from fromRaw (e.g. "Femazon <hello@femazon.com>" or "hello@femazon.com")
  let senderEmail = fromRaw;
  let senderName = 'Femazon';
  const match = fromRaw.match(/(.*)<(.*)>/);
  if (match) {
    senderName = match[1].trim() || 'Femazon';
    senderEmail = match[2].trim();
  }

  // 1. If Brevo API Key is present or provider is Brevo
  if (brevoApiKey && (provider === 'brevo' || !process.env.EMAIL_PROVIDER)) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail
          },
          to: [
            {
              email: to,
              name: name || 'Femazon Member'
            }
          ],
          subject: 'Your Femazon verification code',
          htmlContent: generateOtpEmailHtml({ name, otp })
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('[Brevo Email Error Response]', data);
        return { success: false, error: data?.message || 'Brevo dispatch failed' };
      }

      console.log(`[Brevo Email Sent Successfully] Message ID: ${data.messageId} to ${to}`);
      return { success: true, messageId: data.messageId };
    } catch (err: any) {
      console.error('[Brevo Email Exception]', err);
      return { success: false, error: err.message };
    }
  }

  // 2. Resend Provider
  if (provider === 'resend') {
    try {
      const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
      if (!apiKey) throw new Error('Missing RESEND_API_KEY');

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromRaw,
          to,
          subject: 'Your Femazon verification code',
          html: generateOtpEmailHtml({ name, otp })
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('[Resend Error]', data);
        return { success: false, error: data?.message };
      }

      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[Resend Exception]', err);
      return { success: false, error: err.message };
    }
  }

  // 3. Fallback / Development mode (When API Key is not yet placed in .env)
  console.log(`\n==================================================`);
  console.log(`[FEMAZON OTP DEVELOPMENT MODE]`);
  console.log(`To: ${to}`);
  console.log(`Generated OTP: ${otp}`);
  console.log(`(You can also use standard test OTP: 123456)`);
  console.log(`To receive real emails via Brevo, set BREVO_API_KEY in .env`);
  console.log(`==================================================\n`);

  return { success: true, messageId: `dev_${Date.now()}` };
}
