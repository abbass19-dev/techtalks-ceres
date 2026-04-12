import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (
  to: string,
  resetLink: string,
  firstName: string,
) => {
  try {
    const mailOptions = {
      from: `"CÉRES" <${process.env.SMTP_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:40px auto;padding:0 16px;">
              <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                
                <div style="background:linear-gradient(135deg,#00A859,#00964D);padding:32px 24px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">CÉRES</h1>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">
                    Password Reset Request
                  </p>
                </div>

                <div style="padding:36px 28px;text-align:center;">
                  <h2 style="margin:0 0 16px;color:#111827;font-size:24px;">
                    Reset your password
                  </h2>

                  <p style="margin:0 0 14px;color:#374151;font-size:16px;line-height:1.7;">
                    Hi <strong>${firstName}</strong>,
                  </p>

                  <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.8;">
                    We received a request to reset your password. Click the button below to set a new password.
                  </p>

                  <a
                    href="${resetLink}"
                    style="display:inline-block;padding:14px 30px;background:linear-gradient(90deg,#00A859,#00964D);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;"
                  >
                    Reset Password
                  </a>

                  <p style="margin:24px 0 0;color:#6b7280;font-size:14px;line-height:1.8;">
                    This link will expire in <strong>15 minutes</strong>.
                  </p>

                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;">
                    If you did not request a password reset, you can safely ignore this email.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi ${firstName},\n\nWe received a request to reset your password.\nReset your password here: ${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);

    return { sent: true, info };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send reset password email";

    console.error("Error sending reset password email:", message);

    return { sent: false, error: message };
  }
};
