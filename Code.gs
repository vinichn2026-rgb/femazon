/**
 * ==============================================================================
 * FEMAZON LUXURY COUTURE - GMAIL OTP SENDER SCRIPT (Google Apps Script)
 * ==============================================================================
 * 
 * SETUP INSTRUCTIONS (Takes ~2 minutes):
 * ------------------------------------------------------------------------------
 * 1. Open Google Apps Script:
 *    Visit https://script.google.com and click "+ New project".
 * 
 * 2. Name your project:
 *    Click on "Untitled project" at the top left and rename it to:
 *    "Femazon OTP Sender"
 * 
 * 3. Paste this code:
 *    Select all existing code in Code.gs, delete it, and paste this entire file.
 *    Save the project by pressing Ctrl + S (or Cmd + S).
 * 
 * 4. Deploy as a Web App:
 *    - Click the blue "Deploy" button at the top right -> "New deployment".
 *    - Click the gear icon ⚙️ next to "Select type" and choose "Web app".
 *    - Configure deployment settings:
 *        * Description: "Femazon OTP Mailer"
 *        * Execute as: "Me (<your-gmail-id>@gmail.com)"
 *        * Who has access: "Anyone"  <-- [CRITICAL: Must be "Anyone" so Next.js server can call it]
 *    - Click "Deploy".
 *    - Click "Authorize access" when prompted.
 *    - Choose your Google Account.
 *    - Google will show a warning: "Google hasn't verified this app".
 *      Click "Advanced" (bottom-left) -> Click "Go to Femazon OTP Sender (unsafe)" -> Click "Allow".
 * 
 * 5. Copy your Web App URL:
 *    Under "Web app", copy the URL. It looks like:
 *    https://script.google.com/macros/s/AKfycb.../exec
 * 
 * 6. Update your Femazon project .env file:
 *    GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
 *    GOOGLE_SCRIPT_SECRET="" # Optional: set a secret password if you configure AUTH_SECRET below
 *    EMAIL_PROVIDER="google_script"
 * ------------------------------------------------------------------------------
 */

// Optional security token to protect your endpoint from unauthorized spam.
// If set, any API call must include { "secret": "..." } matching this value.
// Leave as empty string "" if you don't require token verification.
var AUTH_SECRET = "";

/**
 * Handles incoming POST requests from Femazon
 */
function doPost(e) {
  try {
    var payload = {};

    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // Check secret token if enabled
    if (AUTH_SECRET && AUTH_SECRET.trim() !== "") {
      if (!payload.secret || payload.secret !== AUTH_SECRET) {
        return createJsonResponse({
          success: false,
          error: "Unauthorized: Invalid or missing secret token."
        });
      }
    }

    var to = payload.to || payload.email;
    var otp = payload.otp;
    var name = payload.name || "Valued Member";
    var subject = payload.subject || "Your Femazon verification code";
    var customHtml = payload.htmlBody || payload.html;

    if (!to) {
      return createJsonResponse({
        success: false,
        error: "Missing required parameter: 'to' (recipient email)"
      });
    }

    if (!otp && !customHtml) {
      return createJsonResponse({
        success: false,
        error: "Missing required parameter: 'otp' or 'htmlBody'"
      });
    }

    // Build the Femazon luxury email template if not passed in request
    var emailHtml = customHtml || getFemazonOtpTemplate(name, otp);
    var plainTextBody = "Your Femazon verification code is: " + (otp || "") + ". It expires in 10 minutes.";

    // Send via GmailApp (uses your Google account's Gmail API quota - 100-1500 emails/day free)
    GmailApp.sendEmail(to, subject, plainTextBody, {
      name: "Femazon Luxury Couture",
      htmlBody: emailHtml
    });

    return createJsonResponse({
      success: true,
      message: "OTP email successfully sent to " + to,
      recipient: to,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Handles GET requests (Health check / verification in browser)
 */
function doGet(e) {
  return createJsonResponse({
    status: "online",
    service: "Femazon Gmail OTP Mailer",
    message: "Google Apps Script Web App is active and ready to dispatch emails."
  });
}

/**
 * Helper to return JSON responses with proper MIME type
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Built-in Luxury Femazon OTP Email HTML Template
 */
function getFemazonOtpTemplate(name, otp) {
  var firstName = (name || "there").split(" ")[0];
  var year = new Date().getFullYear();

  return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
  '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">' +
  '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
    '<meta name="x-apple-disable-message-reformatting" />' +
    '<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />' +
    '<meta name="color-scheme" content="light dark" />' +
    '<meta name="supported-color-schemes" content="light dark" />' +
    '<title>Your Femazon Verification Code</title>' +
    '<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->' +
    '<style type="text/css">' +
      'html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; }' +
      'div[style*="margin: 16px 0"] { margin: 0 !important; }' +
      'table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; border-collapse: collapse !important; }' +
      'table { border-spacing: 0 !important; }' +
      'img { border: 0 !important; line-height: 100% !important; outline: none !important; text-decoration: none !important; -ms-interpolation-mode: bicubic !important; }' +
      '#outlook a { padding: 0; }' +
      '.ReadMsgBody { width: 100%; }' +
      '.ExternalClass { width: 100%; }' +
      '.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }' +
      'a[x-apple-data-detectors], u + #body a, #MessageViewBody a { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }' +
      '@media only screen and (max-width: 600px) {' +
        '.email-wrapper { padding: 20px 10px !important; }' +
        '.email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; padding: 28px 18px !important; }' +
        '.otp-code { font-size: 30px !important; letter-spacing: 6px !important; }' +
        '.brand-title { font-size: 24px !important; }' +
        '.greeting-title { font-size: 20px !important; }' +
      '}' +
      '@media (prefers-color-scheme: dark) {' +
        'body, .email-body { background-color: #181413 !important; }' +
        '.email-container { background-color: #241D1B !important; border-color: #382D2A !important; }' +
        '.text-title { color: #F7EAE3 !important; }' +
        '.text-subtitle { color: #CDBEB8 !important; }' +
        '.text-body { color: #D3C5BF !important; }' +
        '.otp-card { background-color: #1E1716 !important; border-color: #3E2F2B !important; }' +
        '.otp-label { color: #BCAEAA !important; }' +
        '.otp-code { color: #F7A8A3 !important; }' +
        '.notice-card { background-color: #1E1716 !important; border-color: #3E2F2B !important; }' +
        '.notice-text { color: #CDBEB8 !important; }' +
        '.notice-title { color: #F7EAE3 !important; }' +
        '.footer-text { color: #8C7B76 !important; }' +
        '.divider { border-color: #382D2A !important; }' +
      '}' +
    '</style>' +
  '</head>' +
  '<body id="body" class="email-body" style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #2B1311;">' +
    '<!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellpadding="0" cellspacing="0" width="540"><tr><td align="center" valign="top" width="540"><![endif]-->' +
    '<table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 20px; width: 100%;">' +
      '<tr>' +
        '<td align="center" style="padding: 0;">' +
          '<table role="presentation" class="email-container" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 36px 32px; box-shadow: 0 4px 20px rgba(74, 21, 19, 0.05);">' +
            '<!-- Logo Header -->' +
            '<tr>' +
              '<td align="center" class="divider" style="padding-bottom: 24px; border-bottom: 1px solid #F3EDE9;">' +
                '<h1 class="brand-title text-title" style="font-family: Georgia, \'Times New Roman\', serif; font-size: 28px; font-weight: normal; color: #4A1513; margin: 0; letter-spacing: 3px;">FEMAZON</h1>' +
                '<p class="text-subtitle" style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9A8E8B; margin: 6px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">Luxury Indian Couture &amp; Designer Wear</p>' +
              '</td>' +
            '</tr>' +
            '<!-- Main Greeting & Message -->' +
            '<tr>' +
              '<td style="padding-top: 28px; padding-bottom: 20px;">' +
                '<h2 class="greeting-title text-title" style="font-family: Georgia, \'Times New Roman\', serif; font-size: 22px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0;">Verify your Femazon account</h2>' +
                '<p class="text-body" style="font-size: 14px; line-height: 1.6; color: #6B5E5B; margin: 0 0 24px 0;">' +
                  'Hi ' + firstName + ',<br><br>' +
                  'Thank you for choosing Femazon. Please use the verification code below to complete your authentication.' +
                '</p>' +
                '<!-- OTP Code Display Card -->' +
                '<div class="otp-card" style="background-color: #FAF7F5; border: 1px solid #E5DBD5; border-radius: 14px; padding: 22px 16px; text-align: center; margin: 0 0 24px 0;">' +
                  '<span class="otp-label" style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; color: #6B5E5B; margin-bottom: 8px;">Your Verification Code</span>' +
                  '<span class="otp-code" style="font-family: \'Courier New\', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4A1513;">' + otp + '</span>' +
                '</div>' +
                '<!-- Security & Expiration Info Cards (Universal HTML Entities + Styled Badges) -->' +
                '<table role="presentation" class="notice-card" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 10px 0; padding: 12px 16px;">' +
                  '<tr>' +
                    '<td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">&#9201;</td>' +
                    '<td class="notice-text" valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">' +
                      '<strong class="notice-title" style="color: #4A1513;">Expires in 10 minutes:</strong> Please enter this code promptly to verify your account.' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
                '<table role="presentation" class="notice-card" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDF9F7; border: 1px solid #EFE4DE; border-radius: 12px; margin: 0 0 24px 0; padding: 12px 16px;">' +
                  '<tr>' +
                    '<td width="26" valign="middle" align="center" style="font-size: 16px; color: #8A4F3D; padding-right: 10px; line-height: 1;">&#128274;</td>' +
                    '<td class="notice-text" valign="middle" style="font-size: 13px; line-height: 1.5; color: #6B5E5B;">' +
                      '<strong class="notice-title" style="color: #4A1513;">Confidential:</strong> Please do not share this code with anyone. Femazon staff will never ask for your verification code.' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +
            '<!-- Footer -->' +
            '<tr>' +
              '<td align="center" class="divider footer-text" style="padding-top: 24px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491; line-height: 1.6;">' +
                '<p style="margin: 0 0 6px 0;">&copy; ' + year + ' Femazon Luxury Couture. All rights reserved.</p>' +
                '<p style="margin: 0;">If you did not request this verification code, please ignore this email.</p>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
      '</tr>' +
    '</table>' +
    '<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->' +
  '</body>' +
  '</html>';
}

/**
 * TEST FUNCTION:
 * Run this directly inside Google Apps Script editor by selecting "testSendOtp" from the dropdown and clicking "Run"
 */
function testSendOtp() {
  var testEmail = Session.getActiveUser().getEmail(); // Sends test email to your own Gmail address!
  Logger.log("Testing email dispatch to: " + testEmail);
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        to: testEmail,
        name: "Test User",
        otp: "889900",
        subject: "Test Femazon Verification Code"
      })
    }
  };
  var response = doPost(mockEvent);
  Logger.log("Result: " + response.getContent());
}
