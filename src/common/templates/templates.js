export const otpTemplate = ({
  title = "Email Verification",
  message = "Please use the verification code below to complete your request.",
  otp,
  expiresIn = "5 minutes",
} = {}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 30px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);">
              <tr>
                <td style="padding-bottom: 12px;">
                  <h2 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700;">
                    ${title}
                  </h2>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 24px;">
                  <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                    ${message}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <div style="display: inline-block; background-color: #f3f4f6; border: 1px dashed #9ca3af; border-radius: 8px; padding: 14px 28px; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #111827;">
                    ${otp}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                  <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                    This code will expire in <strong>${expiresIn}</strong>. If you did not request this, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};