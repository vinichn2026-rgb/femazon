/**
 * Femazon Luxury Couture — Transactional Email Service
 * 
 * Supports production email providers:
 * - Google Apps Script (Gmail API Web App)
 * - Brevo (Sendinblue)
 * - Resend
 * - SendGrid / SMTP
 * 
 * Environment variables:
 * - GOOGLE_SCRIPT_URL (Google Apps Script Web App URL for Gmail dispatch)
 * - GOOGLE_SCRIPT_SECRET (Optional security secret token)
 * - BREVO_API_KEY (or EMAIL_API_KEY)
 * - EMAIL_PROVIDER (e.g. 'google_script', 'brevo', 'resend', 'smtp')
 * - EMAIL_FROM (e.g. 'Femazon <hello@femazon.com>' or verified sender email in Brevo)
 */

export interface SendOtpEmailParams {
  to: string;
  name?: string;
  otp: string;
}

export function generateOtpEmailHtml({ name, otp }: { name?: string; otp: string }) {
  const displayName = name ? name.split(' ')[0] : 'there';
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Your Femazon verification code</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* ==========================================================
       GLOBAL CSS RESETS FOR ALL EMAIL PROVIDERS
       (Gmail, Outlook, Apple Mail, Yahoo, Samsung, etc.)
       ========================================================== */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      -webkit-font-smoothing: antialiased !important;
    }
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
      border-collapse: collapse !important;
    }
    table {
      border-spacing: 0 !important;
    }
    img {
      border: 0 !important;
      line-height: 100% !important;
      outline: none !important;
      text-decoration: none !important;
      -ms-interpolation-mode: bicubic !important;
    }
    #outlook a {
      padding: 0;
    }
    .ReadMsgBody {
      width: 100%;
    }
    .ExternalClass {
      width: 100%;
    }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
      line-height: 100%;
    }
    /* iOS & Gmail Unwanted Auto-Link Fixes */
    a[x-apple-data-detectors],
    u + #body a,
    #MessageViewBody a {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    /* Responsive Mobile Styles */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 14px !important;
        padding: 28px 18px !important;
      }
      .otp-code {
        font-size: 30px !important;
        letter-spacing: 6px !important;
      }
      .brand-title {
        font-size: 24px !important;
      }
      .greeting-title {
        font-size: 20px !important;
      }
    }
    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      body, .email-body {
        background-color: #181413 !important;
      }
      .email-container {
        background-color: #241D1B !important;
        border-color: #382D2A !important;
      }
      .text-title {
        color: #F7EAE3 !important;
      }
      .text-subtitle {
        color: #CDBEB8 !important;
      }
      .text-body {
        color: #D3C5BF !important;
      }
      .otp-card {
        background-color: #1E1716 !important;
        border-color: #3E2F2B !important;
      }
      .otp-label {
        color: #BCAEAA !important;
      }
      .otp-code {
        color: #F7A8A3 !important;
      }
      .notice-card {
        background-color: #1E1716 !important;
        border-color: #3E2F2B !important;
      }
      .notice-text {
        color: #CDBEB8 !important;
      }
      .notice-title {
        color: #F7EAE3 !important;
      }
      .footer-text {
        color: #8C7B76 !important;
      }
      .divider {
        border-color: #382D2A !important;
      }
    }
  </style>
</head>
<body id="body" class="email-body" style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1311;">
  <!--[if (gte mso 9)|(IE)]>
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="540">
    <tr>
      <td align="center" valign="top" width="540">
  <![endif]-->
  <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 20px; width: 100%;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" class="email-container" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 36px 32px; box-shadow: 0 4px 20px rgba(74, 21, 19, 0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" class="divider" style="padding-bottom: 24px; border-bottom: 1px solid #F3EDE9;">
              <h1 class="brand-title text-title" style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; color: #4A1513; margin: 0; letter-spacing: 3px;">
                FEMAZON
              </h1>
              <p class="text-subtitle" style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9A8E8B; margin: 6px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Luxury Indian Couture &amp; Designer Wear
              </p>
            </td>
          </tr>

          <!-- Main Greeting & Message -->
          <tr>
            <td style="padding-top: 28px; padding-bottom: 20px;">
              <h2 class="greeting-title text-title" style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0;">
                Verify your Femazon account
              </h2>
              <p class="text-body" style="font-size: 14px; line-height: 1.6; color: #6B5E5B; margin: 0 0 24px 0;">
                Hi ${displayName},<br><br>
                Thank you for choosing Femazon. Please use the verification code below to complete your authentication.
              </p>

              <!-- OTP Code Display Card -->
              <div class="otp-card" style="background-color: #FAF7F5; border: 1px solid #E5DBD5; border-radius: 14px; padding: 22px 16px; text-align: center; margin: 0 0 24px 0;">
                <span class="otp-label" style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; color: #6B5E5B; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <span class="otp-code" style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4A1513;">
                  ${otp}
                </span>
              </div>

              <!-- Security & Expiration Info Cards (Universal HTML Entities + Styled Badges) -->
              <table role="presentation" class="notice-card" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 10px 0; padding: 12px 16px;">
                <tr>
                  <td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">
                    &#9201;
                  </td>
                  <td class="notice-text" valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    <strong class="notice-title" style="color: #4A1513;">Expires in 10 minutes:</strong> Please enter this code promptly to verify your account.
                  </td>
                </tr>
              </table>

              <table role="presentation" class="notice-card" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 24px 0; padding: 12px 16px;">
                <tr>
                  <td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">
                    &#128274;
                  </td>
                  <td class="notice-text" valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    <strong class="notice-title" style="color: #4A1513;">Confidential:</strong> Please do not share this code with anyone. Femazon staff will never ask for your verification code.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" class="divider footer-text" style="padding-top: 24px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491; line-height: 1.6;">
              <p style="margin: 0 0 6px 0;">&copy; ${currentYear} Femazon Luxury Couture. All rights reserved.</p>
              <p style="margin: 0;">If you did not request this verification code, please ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  <!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>
  `;
}

/**
 * Server-side email sender handler
 */
export async function sendOtpEmail({ to, name, otp }: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.GMAIL_APP_SCRIPT_URL;
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  const provider = (process.env.EMAIL_PROVIDER || (googleScriptUrl ? 'google_script' : (process.env.BREVO_API_KEY ? 'brevo' : ''))).toLowerCase();
  const fromRaw = process.env.EMAIL_FROM || 'hello@femazon.com';

  // Parse Sender Name and Email from fromRaw (e.g. "Femazon <hello@femazon.com>" or "hello@femazon.com")
  let senderEmail = fromRaw;
  let senderName = 'Femazon';
  const match = fromRaw.match(/(.*)<(.*)>/);
  if (match) {
    senderName = match[1].trim() || 'Femazon';
    senderEmail = match[2].trim();
  }

  // 1. Google Apps Script / Gmail API Webhook
  if (googleScriptUrl && (provider === 'google_script' || provider === 'gmail' || provider === 'google' || !process.env.EMAIL_PROVIDER)) {
    try {
      const html = generateOtpEmailHtml({ name, otp });
      const res = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          to,
          name: name || 'Femazon Member',
          otp,
          subject: 'Your Femazon verification code',
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
        console.error('\n❌ [Google Script Gmail Error]:', data);
        return { success: false, error: data?.error || data?.message || 'Google Apps Script dispatch failed' };
      }

      console.log(`\n✅ [Google Script Gmail Sent Successfully] to ${to}\n`);
      return { success: true, messageId: data.messageId || `gas_${Date.now()}` };
    } catch (err: any) {
      console.error('[Google Script Gmail Exception]', err);
      return { success: false, error: err.message };
    }
  }

  // 2. If Brevo API Key is present or provider is Brevo
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
        console.error('\n❌ [Brevo API Error Response]:', JSON.stringify(data, null, 2));
        if (data?.message && data.message.includes('unrecognised IP address')) {
          console.error(`⚠️ Brevo requires IP authorization for this machine. Please visit https://app.brevo.com/security/authorised_ips and add IP: 103.130.204.193\n`);
        }
        return { success: false, error: data?.message || 'Brevo dispatch failed' };
      }

      console.log(`\n✅ [Brevo Email Sent Successfully] Message ID: ${data.messageId} to ${to}\n`);
      return { success: true, messageId: data.messageId };
    } catch (err: any) {
      console.error('[Brevo Email Exception]', err);
      return { success: false, error: err.message };
    }
  }

  // 2. SMTP Provider (Nodemailer - e.g. Gmail / Custom SMTP)
  if (provider === 'smtp' || process.env.SMTP_USER) {
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

      const info = await transporter.sendMail({
        from: fromRaw,
        to,
        subject: 'Your Femazon verification code',
        html: generateOtpEmailHtml({ name, otp })
      });

      console.log(`\n✅ [SMTP Email Sent Successfully] Message ID: ${info.messageId} to ${to}\n`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[SMTP Email Exception]', err);
      return { success: false, error: err.message };
    }
  }

  // 3. Resend Provider
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

  // 4. Fallback / Development mode
  console.log(`\n==================================================`);
  console.log(`[FEMAZON OTP DEVELOPMENT MODE]`);
  console.log(`To: ${to}`);
  console.log(`Generated OTP: ${otp}`);
  console.log(`(You can also use standard test OTP: 123456)`);
  console.log(`==================================================\n`);

  return { success: true, messageId: `dev_${Date.now()}` };
}
