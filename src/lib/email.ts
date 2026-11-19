/**
 * Femazon Luxury Couture — Transactional Email Service
 * 
 * Supported Providers:
 * 1. Resend (Transactional Email API via EMAIL_API_KEY or RESEND_API_KEY)
 * 2. Google Apps Script (Gmail Web App via GOOGLE_SCRIPT_URL)
 * 3. SMTP (Nodemailer via SMTP_HOST, SMTP_USER, SMTP_PASS)
 * 4. Development mode (Logs payload to server console without throwing)
 * 
 * Environment variables:
 * - EMAIL_API_KEY / RESEND_API_KEY: Resend API Key (e.g. re_...)
 * - EMAIL_FROM: Sender identity (e.g. 'Femazon <onboarding@resend.dev>' or 'Femazon <vinichn2026@gmail.com>')
 * - GOOGLE_SCRIPT_URL: Google Apps Script Web App URL
 * - GOOGLE_SCRIPT_SECRET: Optional Google Apps Script secret
 * - SUPPORT_EMAIL: Femazon partner care email (e.g. 'support@femazon.com')
 */

export interface SendOtpEmailParams {
  to: string;
  name?: string;
  otp: string;
  verificationUrl?: string;
}

export interface SendVendorApprovalEmailParams {
  to: string;
  vendorName?: string;
  shopName: string;
  vendorId: number | string;
  loginUrl?: string;
  dashboardUrl?: string;
  supportEmail?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Universal server-side email dispatcher supporting Resend, Google Apps Script, SMTP and Dev fallback
 */
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  from
}: SendEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fromAddress = from || process.env.EMAIL_FROM || 'Femazon <onboarding@resend.dev>';
  const resendApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
  const rawGoogleScriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.GMAIL_APP_SCRIPT_URL;

  // Validate Google Script URL to ensure it is not a placeholder or unconfigured
  const isGoogleScriptConfigured = 
    Boolean(rawGoogleScriptUrl) && 
    rawGoogleScriptUrl!.startsWith('https://script.google.com/') && 
    !rawGoogleScriptUrl!.includes('...') && 
    !rawGoogleScriptUrl!.includes('YOUR_');

  // 1. Transactional Provider: Resend API
  if (resendApiKey) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Resend API] Dispatching "${subject}" to: ${to}...`);
      }
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html
        }),
        signal: AbortSignal.timeout(8000)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        console.error('❌ [Resend API Error]:', data);
        return {
          success: false,
          error: data?.error?.message || data?.message || 'Resend email dispatch failed'
        };
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ [Resend Sent Successfully] ID: ${data.id} to ${to}`);
      }
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('❌ [Resend API Exception]:', err?.message || err);
      return { success: false, error: err?.message || 'Resend API network timeout or failure' };
    }
  }

  // 2. Google Apps Script Web App (Gmail API Dispatcher)
  if (isGoogleScriptConfigured) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Google Apps Script] Dispatching "${subject}" to: ${to}...`);
      }
      const res = await fetch(rawGoogleScriptUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          to,
          subject,
          htmlBody: html,
          secret: process.env.GOOGLE_SCRIPT_SECRET || ''
        }),
        redirect: 'follow',
        signal: AbortSignal.timeout(8000)
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (!res.ok || data.success === false || responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        let cleanErr = data?.error || data?.message;
        if (typeof cleanErr === 'string' && (cleanErr.includes('Access Denied') || cleanErr.includes('<!DOCTYPE html>') || cleanErr.includes('<html'))) {
          cleanErr = 'Google Apps Script Access Denied. In Google Apps Script, click Deploy > Manage deployments > Edit > set "Who has access" to "Anyone" and redeploy.';
        }
        console.error('❌ [Google Apps Script Error]:', cleanErr);
        return {
          success: false,
          error: cleanErr || 'Google Apps Script email dispatch failed'
        };
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ [Google Apps Script Sent Successfully] to ${to}`);
      }
      return { success: true, messageId: data.messageId || `gas_${Date.now()}` };
    } catch (err: any) {
      console.error('❌ [Google Apps Script Exception]:', err?.message || err);
      return { success: false, error: err?.message || 'Google Apps Script connection timeout or error' };
    }
  }

  // 3. SMTP Provider (Nodemailer)
  if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)) {
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
        from: fromAddress,
        to,
        subject,
        html
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ [SMTP Email Sent Successfully] Message ID: ${info.messageId} to ${to}`);
      }
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('❌ [SMTP Email Exception]:', err?.message || err);
      return { success: false, error: err?.message || 'SMTP email delivery failed' };
    }
  }

  // 4. Production vs Development fallback
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ [Email Dispatcher]: No valid email provider configured in production environment variables.');
    return {
      success: false,
      error: 'Email service is not configured on production. Please configure RESEND_API_KEY, GOOGLE_SCRIPT_URL, or SMTP_USER in Vercel Environment Variables.'
    };
  }

  // Local development mode logger
  console.log(`\n==================================================`);
  console.log(`⚠️ [FEMAZON LOCAL DEV EMAIL SIMULATOR]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From: ${fromAddress}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`(Configure RESEND_API_KEY, GOOGLE_SCRIPT_URL, or SMTP credentials in .env to deliver real emails)`);
  console.log(`==================================================\n`);

  return { success: true, messageId: `dev_${Date.now()}` };
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
 * Generates dynamic HTML template for Vendor Approval Notification
 */
export function generateVendorApprovalEmailHtml({
  vendorName,
  shopName,
  to,
  vendorId,
  loginUrl,
  dashboardUrl,
  supportEmail
}: SendVendorApprovalEmailParams): string {
  const currentYear = new Date().getFullYear();
  const recipientGreeting = vendorName ? vendorName.trim() : shopName;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Congratulations! Your Femazon Vendor Account Is Approved</title>
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
    table, td { border-collapse: collapse !important; }
    img { border: 0 !important; outline: none !important; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 16px 8px !important; }
      .email-container { width: 100% !important; border-radius: 14px !important; padding: 24px 16px !important; }
      .detail-label { display: block !important; width: 100% !important; margin-bottom: 4px !important; }
      .detail-value { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1311;">
  <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 16px; width: 100%;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 40px 36px; box-shadow: 0 4px 24px rgba(74, 21, 19, 0.06);">
          
          <!-- Logo & Brand Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 2px solid #F3EDE9;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 34px; font-weight: 300; letter-spacing: 6px; color: #4A1513; margin: 0; text-transform: uppercase;">
                FEMAZON
              </h1>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #A09491; margin: 6px 0 0 0;">
                Verified Boutique &amp; Designer Partner Portal
              </p>
            </td>
          </tr>

          <!-- Congratulations Badge & Title -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <span style="display: inline-block; background-color: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 50px; margin-bottom: 16px;">
                &#10003; Official Partnership Approved
              </span>
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0; line-height: 1.3;">
                Congratulations, ${recipientGreeting}!
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: #6B5E5B; margin: 0 auto 28px auto; max-width: 480px;">
                Your application to join Femazon as a boutique partner for <strong style="color: #4A1513;">${shopName}</strong> has been officially approved. Your seller portal is now live and ready for listing.
              </p>
            </td>
          </tr>

          <!-- Dynamic Vendor Account Details Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FCF9F6; border: 1px solid #EAE0D8; border-radius: 16px; margin: 0 0 28px 0; padding: 20px 24px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 14px; border-bottom: 1px dashed #E0D3C9;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #8A4F3D;">
                      Account Summary
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="detail-label" style="padding-top: 14px; padding-bottom: 8px; font-size: 13px; color: #8C7B76; width: 45%;">
                    Vendor / Shop Name:
                  </td>
                  <td class="detail-value" style="padding-top: 14px; padding-bottom: 8px; font-size: 14px; font-weight: 600; color: #2B1311; width: 55%;">
                    ${shopName}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label" style="padding-bottom: 8px; font-size: 13px; color: #8C7B76;">
                    Registered Email:
                  </td>
                  <td class="detail-value" style="padding-bottom: 8px; font-size: 14px; font-weight: 600; color: #2B1311;">
                    ${to}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label" style="padding-bottom: 8px; font-size: 13px; color: #8C7B76;">
                    Vendor Registration ID:
                  </td>
                  <td class="detail-value" style="padding-bottom: 8px; font-size: 14px; font-weight: 600; font-family: monospace; color: #4A1513;">
                    #${vendorId}
                  </td>
                </tr>
                <tr>
                  <td class="detail-label" style="font-size: 13px; color: #8C7B76;">
                    Account Status:
                  </td>
                  <td class="detail-value" style="font-size: 13px; font-weight: 700; color: #047857;">
                    APPROVED &#10003;
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 50px; background-color: #4A1513;">
                    <a href="${loginUrl || 'http://localhost:3000/vendor/login'}" target="_blank" style="display: inline-block; background-color: #4A1513; color: #FFFFFF; font-size: 14px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 16px 38px; border-radius: 50px; border: 1px solid #4A1513; box-shadow: 0 4px 16px rgba(74, 21, 19, 0.25);">
                      Access Vendor Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 12px; color: #8C7B76; margin: 12px 0 0 0;">
                Direct URL: <a href="${loginUrl || 'http://localhost:3000/vendor/login'}" style="color: #4A1513; text-decoration: underline;">${loginUrl || 'http://localhost:3000/vendor/login'}</a>
              </p>
            </td>
          </tr>

          <!-- Login Instructions / Next Steps -->
          <tr>
            <td style="padding-bottom: 24px; border-top: 1px solid #F3EDE9; padding-top: 24px;">
              <h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: normal; color: #2B1311; margin: 0 0 14px 0;">
                How to Get Started:
              </h3>
              <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.7; color: #6B5E5B;">
                <li style="margin-bottom: 8px;">
                  Open the Vendor Portal at <a href="${loginUrl || 'http://localhost:3000/vendor/login'}" style="color: #4A1513; font-weight: 600;">/vendor/login</a>.
                </li>
                <li style="margin-bottom: 8px;">
                  Sign in using your registered email address (<strong style="color: #2B1311;">${to}</strong>) and your account password.
                </li>
                <li style="margin-bottom: 8px;">
                  Navigate to your <strong style="color: #2B1311;">Vendor Dashboard</strong> to add luxury apparel, configure color/size variants, and set pricing.
                </li>
                <li>
                  Your products will be featured on Femazon once added, and customer orders will appear live in your dashboard.
                </li>
              </ol>
            </td>
          </tr>

          <!-- Security & Privacy Notice -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; padding: 14px 18px;">
                <tr>
                  <td width="28" valign="top" style="font-size: 16px; padding-top: 2px;">
                    &#128274;
                  </td>
                  <td style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    <strong style="color: #4A1513;">Security Reminder:</strong> Your account uses the credentials you registered with. For your security, passwords are never transmitted via email. Femazon staff will never ask for your password.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${supportEmail ? `
          <!-- Support Contact Section -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; border-radius: 12px; padding: 14px 18px; text-align: center;">
                <tr>
                  <td style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">
                    Questions or need onboarding assistance? Contact Femazon Partner Support at <a href="mailto:${supportEmail}" style="color: #4A1513; font-weight: 600;">${supportEmail}</a>.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491; line-height: 1.6;">
              <p style="margin: 0 0 6px 0;">&copy; ${currentYear} Femazon Luxury Couture Inc. All rights reserved.</p>
              <p style="margin: 0;">This email was sent to ${to} regarding your Femazon Vendor account #${vendorId}.</p>
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
 * Server-side email sender for OTP Verification
 */
export async function sendOtpEmail({ 
  to, 
  name, 
  otp, 
  verificationUrl 
}: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const defaultBaseUrl = process.env.NODE_ENV === 'production' ? 'https://femazon-beta.vercel.app' : 'http://localhost:3000';
  const baseUrl = process.env.NEXTAUTH_URL || defaultBaseUrl;
  const autoVerificationUrl = verificationUrl || `${baseUrl}/login?identifier=${encodeURIComponent(to)}&otp=${otp}`;
  const html = generateOtpEmailHtml({ name, otp, verificationUrl: autoVerificationUrl });

  return sendTransactionalEmail({
    to,
    subject: 'Your Femazon verification code & login link',
    html
  });
}

/**
 * Server-side email sender for Vendor Approval
 */
export async function sendVendorApprovalEmail(
  params: SendVendorApprovalEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const defaultBaseUrl = process.env.NODE_ENV === 'production' ? 'https://femazon-beta.vercel.app' : 'http://localhost:3000';
  const baseUrl = process.env.NEXTAUTH_URL || defaultBaseUrl;
  const loginUrl = params.loginUrl || `${baseUrl}/vendor/login`;
  const dashboardUrl = params.dashboardUrl || `${baseUrl}/vendor/dashboard`;
  const supportEmail = params.supportEmail || process.env.SUPPORT_EMAIL || 'support@femazon.com';

  const html = generateVendorApprovalEmailHtml({
    ...params,
    loginUrl,
    dashboardUrl,
    supportEmail
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: 'Congratulations! Your Femazon Vendor Account Is Approved',
    html
  });
}
