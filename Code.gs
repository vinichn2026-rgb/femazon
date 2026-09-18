/**
 * ==============================================================================
 * FEMAZON LUXURY COUTURE - GMAIL OTP SENDER SCRIPT (Google Apps Script)
 * ==============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Apps Script:
 *    Visit https://script.google.com and open your project.
 * 
 * 2. Paste this code:
 *    Select all existing code in Code.gs, delete it, and paste this file.
 *    Press Ctrl + S to save.
 * 
 * 3. Deploy as a Web App:
 *    - Click "Deploy" -> "New deployment" (or "Manage deployments" -> Edit -> New version)
 *    - Click ⚙️ next to "Select type" -> "Web app"
 *    - Description: "Femazon OTP Mailer"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required so your server can call it)
 *    - Click "Deploy"
 *    - Authorize access with your Google account
 * 
 * 4. Copy Web App URL into .env:
 *    GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
 * ==============================================================================
 */

// Optional security token. Leave as "" to allow requests without token check.
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
    var verificationUrl = payload.verificationUrl || payload.link || "";
    var subject = payload.subject || "Your Femazon verification code & login link";
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

    // Build the email body
    var emailHtml = customHtml || getFemazonOtpTemplate(name, otp, verificationUrl);
    var plainTextBody = "Your Femazon verification code is: " + (otp || "") + ". It expires in 10 minutes." + (verificationUrl ? "\n\nDirect Login Link: " + verificationUrl : "");

    // Send via GmailApp
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
 * Handles GET requests (Health check in browser)
 */
function doGet(e) {
  return createJsonResponse({
    status: "online",
    service: "Femazon Gmail OTP Mailer",
    message: "Google Apps Script Web App is active and ready to dispatch emails."
  });
}

/**
 * Helper to return JSON responses
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Built-in Luxury Femazon OTP Email Template with Direct Verification Button
 */
function getFemazonOtpTemplate(name, otp, verificationUrl) {
  var firstName = (name || "there").split(" ")[0];
  var year = new Date().getFullYear();

  var buttonHtml = "";
  if (verificationUrl) {
    buttonHtml = '<table width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">' +
      '<tr><td align="center">' +
        '<a href="' + verificationUrl + '" target="_blank" style="display: inline-block; background-color: #4A1513; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 1px; padding: 14px 32px; border-radius: 50px; text-transform: uppercase;">Verify &amp; Sign In Directly</a>' +
      '</td></tr>' +
      '<tr><td align="center" style="padding-top: 10px;">' +
        '<span style="font-size: 11px; color: #8C7B76;">Or link: <a href="' + verificationUrl + '" style="color: #8A4F3D; word-break: break-all;">' + verificationUrl + '</a></span>' +
      '</td></tr>' +
    '</table>';
  }

  return '<!DOCTYPE html>' +
  '<html>' +
  '<head>' +
    '<meta charset="UTF-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
    '<title>Your Femazon Verification Code</title>' +
  '</head>' +
  '<body style="margin: 0; padding: 0; background-color: #FAF7F5; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #2B1311;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F5; padding: 40px 20px;">' +
      '<tr>' +
        '<td align="center">' +
          '<table width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #EAE4E0; padding: 36px 32px; box-shadow: 0 4px 20px rgba(74, 21, 19, 0.05);">' +
            '<tr>' +
              '<td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #F3EDE9;">' +
                '<h1 style="font-family: Georgia, serif; font-size: 32px; font-weight: 300; letter-spacing: 6px; color: #4A1513; margin: 0; text-transform: uppercase;">FEMAZON</h1>' +
                '<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9A8E8B; margin: 6px 0 0 0;">Luxury Indian Couture &amp; Designer Wear</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding-top: 28px; padding-bottom: 20px;">' +
                '<h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #2B1311; margin: 0 0 12px 0;">Verify your Femazon account</h2>' +
                '<p style="font-size: 14px; line-height: 1.6; color: #6B5E5B; margin: 0 0 24px 0;">Hi ' + firstName + ',<br><br>Thank you for choosing Femazon. Use your verification code below or click the direct verification button to sign in securely.</p>' +
                '<div style="background-color: #FAF7F5; border: 1px solid #E5DBD5; border-radius: 14px; padding: 22px 16px; text-align: center; margin: 0 0 24px 0;">' +
                  '<span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; color: #6B5E5B; margin-bottom: 8px;">Your Verification Code</span>' +
                  '<span style="font-family: \'Courier New\', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4A1513;">' + otp + '</span>' +
                '</div>' +
                buttonHtml +
                '<p style="font-size: 12px; color: #8A4F3D; margin: 0;">⏳ <strong>Expires in 10 minutes</strong>. Please do not share this code with anyone.</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td align="center" style="padding-top: 24px; border-top: 1px solid #F3EDE9; font-size: 11px; color: #A09491; line-height: 1.6;">' +
                '<p style="margin: 0 0 6px 0;">&copy; ' + year + ' Femazon Luxury Couture. All rights reserved.</p>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
      '</tr>' +
    '</table>' +
  '</body>' +
  '</html>';
}
