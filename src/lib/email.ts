/**
 * Femazon Luxury Couture — Transactional Email Service
 * 
 * Primary Email Provider:
 * - Google Apps Script (Gmail API Web App)
 * 
 * Environment variables:
 * - GOOGLE_SCRIPT_URL (Google Apps Script Web App URL for Gmail dispatch)
 * - GOOGLE_SCRIPT_SECRET (Optional security secret token)
 * - EMAIL_PROVIDER (Defaults to 'google_script')
 * - EMAIL_FROM (e.g. 'Femazon <vinichn2026@gmail.com>')
 */

export interface SendOtpEmailParams {
  to: string;
  name?: string;
  otp: string;
  verificationUrl?: string;
}

export function generateOtpEmailHtml({ 
  name, 
  otp, 
  verificationUrl 
}: { 
  name?: string; 
  otp: string; 
  verificationUrl?: string;
}) {
  const displayName = name ? name.split(' ')[0] : 'there';
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Your Femazon verification code</title>
  <style type="text/css">
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      -webkit-font-smoothing: antialiased !important;
    }
    table, td {
      border-collapse: collapse !important;
    }
    img {
      border: 0 !important;
      outline: none !important;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px !important; }
      .email-container { width: 100% !important; border-radius: 14px !important; padding: 28px 18px !important; }
      .otp-code { font-size: 30px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1311;">
  <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 20px; width: 100%;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" class="email-container" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 36px 32px; box-shadow: 0 4px 20px rgba(74, 21, 19, 0.05);">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #F3EDE9;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 300; letter-spacing: 6px; color: #4A1513; margin: 0; text-transform: uppercase;">
                FEMAZON
              </h1>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9A8E8B; margin: 6px 0 0 0;">
                Luxury Indian Couture &amp; Designer Wear
              </p>
            </td>
          </tr>

          <!-- Main Greeting & Message -->
          <tr>
            <td style="padding-top: 28px; padding-bottom: 20px;">
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0;">
                Verify your Femazon account
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #6B5E5B; margin: 0 0 24px 0;">
                Hi ${displayName},<br><br>
                Thank you for choosing Femazon. Use the verification code below or click the direct verification button to sign in securely.
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #FAF7F5; border: 1px solid #E5DBD5; border-radius: 14px; padding: 22px 16px; text-align: center; margin: 0 0 24px 0;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; color: #6B5E5B; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <span class="otp-code" style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4A1513;">
                  ${otp}
                </span>
              </div>

              ${verificationUrl ? `
              <!-- 1-Click Direct Verification Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #4A1513; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 1px; padding: 14px 32px; border-radius: 50px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(74, 21, 19, 0.2);">
                      Verify &amp; Sign In Directly
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #8C7B76;">Or click here: <a href="${verificationUrl}" style="color: #8A4F3D; word-break: break-all;">${verificationUrl}</a></span>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Security Notices -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 10px 0; padding: 12px 16px;">
                <tr>
                  <td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">
                    &#9201;
                  </td>
                  <td valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    <strong style="color: #4A1513;">Expires in 10 minutes:</strong> Please enter this code promptly to verify your account.
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 24px 0; padding: 12px 16px;">
                <tr>
                  <td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">
                    &#128274;
                  </td>
                  <td valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    <strong style="color: #4A1513;">Confidential:</strong> Please do not share this code with anyone. Femazon staff will never ask for your verification code.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491; line-height: 1.6;">
              <p style="margin: 0 0 6px 0;">&copy; ${currentYear} Femazon Luxury Couture. All rights reserved.</p>
              <p style="margin: 0;">If you did not request this verification code, please ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Server-side email sender handler (Google Apps Script Gmail Dispatcher)
 */
export async function sendOtpEmail({ 
  to, 
  name, 
  otp, 
  verificationUrl 
}: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.GMAIL_APP_SCRIPT_URL;
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const autoVerificationUrl = verificationUrl || `${baseUrl}/login?identifier=${encodeURIComponent(to)}&otp=${otp}`;

  // 1. Primary: Google Apps Script Web App (Gmail API)
  if (googleScriptUrl) {
    try {
      const html = generateOtpEmailHtml({ 
        name, 
        otp, 
        verificationUrl: autoVerificationUrl 
      });

      console.log(`[Google Apps Script] Dispatching OTP email to: ${to}...`);

      const res = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          to,
          name: name || 'Femazon Member',
          otp,
          verificationUrl: autoVerificationUrl,
          subject: 'Your Femazon verification code & login link',
          htmlBody: html,
          secret: process.env.GOOGLE_SCRIPT_SECRET || ''
        }),
        redirect: 'follow'
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (!res.ok || data.success === false) {
        console.error('❌ [Google Apps Script Error]:', data);
        return { 
          success: false, 
          error: data?.error || data?.message || 'Google Apps Script dispatch failed' 
        };
      }

      console.log(`✅ [Google Apps Script Gmail Sent Successfully] to ${to}`);
      return { success: true, messageId: data.messageId || `gas_${Date.now()}` };
    } catch (err: any) {
      console.error('❌ [Google Apps Script Exception]:', err);
      return { success: false, error: err.message };
    }
  }

  // 2. SMTP Provider (Optional fallback if SMTP credentials exist)
  if (process.env.SMTP_USER) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD
        }
      });

      const fromRaw = process.env.EMAIL_FROM || 'hello@femazon.com';
      const info = await transporter.sendMail({
        from: fromRaw,
        to,
        subject: 'Your Femazon verification code & login link',
        html: generateOtpEmailHtml({ name, otp, verificationUrl: autoVerificationUrl })
      });

      console.log(`✅ [SMTP Email Sent Successfully] Message ID: ${info.messageId} to ${to}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('❌ [SMTP Email Exception]:', err);
      return { success: false, error: err.message };
    }
  }

  // 3. Fallback / Development mode when GOOGLE_SCRIPT_URL is not set
  console.log(`\n==================================================`);
  console.log(`⚠️ [FEMAZON OTP DEVELOPMENT MODE]`);
  console.log(`To: ${to}`);
  console.log(`Generated OTP: ${otp}`);
  console.log(`Direct Link: ${autoVerificationUrl}`);
  console.log(`(Configure GOOGLE_SCRIPT_URL in .env to send real emails)`);
  console.log(`==================================================\n`);

  return { success: true, messageId: `dev_${Date.now()}` };
}
