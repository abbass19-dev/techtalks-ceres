import nodemailer from "nodemailer";

const getEmailErrorMessage = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Failed to send reset password email";

  if (message.includes("535") || message.includes("BadCredentials")) {
    return "Gmail rejected the login. Check SMTP_USER and Google App Password.";
  }

  return message;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return map[char];
  });

const resetPasswordTemplate = (firstName: string, resetLink: string) => {
  const safeName = escapeHtml(firstName || "there");

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
  </head>

  <body style="margin:0;padding:0;background:#eef5f0;font-family:Arial,Helvetica,sans-serif;color:#17211b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Reset your CERES password. This secure link expires in 15 minutes.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 14px;background:#eef5f0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #dbe8dd;box-shadow:0 24px 70px rgba(15,67,38,.14);">
            
            <tr>
              <td style="padding:34px 34px 30px;background:linear-gradient(135deg,#064e3b,#10b981);">
                <p style="margin:0 0 18px;color:#d1fae5;font-size:12px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;">
                  CERES Security
                </p>

                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.2;font-weight:900;">
                  Reset your password
                </h1>

                <p style="margin:14px 0 0;color:#ecfdf5;font-size:16px;line-height:1.7;">
                  A secure password reset was requested for your CERES account.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 32px;">
                <p style="margin:0 0 18px;font-size:17px;line-height:1.7;color:#17211b;">
                  Hi <strong>${safeName}</strong>,
                </p>

                <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#4b5563;">
                  Click the button below to create a new password. For your security, this link will expire in <strong>15 minutes</strong>.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                  <tr>
                    <td style="border-radius:999px;background:#059669;box-shadow:0 12px 26px rgba(5,150,105,.28);">
                      <a href="${resetLink}" style="display:inline-block;padding:15px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:999px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <div
                    style="
                    padding:20px;
                    background:#f6faf7;
                    border:1px solid #dcefe2;
                    border-radius:18px;
                    margin:0 0 28px;
                    text-align:center;
                    "
                    >
                    <p
                    style="
                    margin:0;
                    color:#6b7280;
                    font-size:13px;
                    line-height:1.8;
                    "
                    >
                    This secure reset link expires in 15 minutes.
                    </p>
                </div>

                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.7;">
                  If you did not request this password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 34px;background:#f8fbf8;border-top:1px solid #e5eee7;">
                <p style="margin:0;color:#7c8a80;font-size:12px;line-height:1.6;">
                  © CERES — Precision Nutrition Intelligence
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const sendResetPasswordEmail = async (
  to: string,
  resetLink: string,
  firstName: string,
) => {
  try {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, "");

    if (!smtpUser || !smtpPassword) {
      throw new Error("SMTP_USER and SMTP_PASSWORD must be configured.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"CERES" <${smtpUser}>`,
      to,
      subject: "Reset Your CERES Password",
      html: resetPasswordTemplate(firstName, resetLink),
      text: `Hi ${firstName || "there"},

We received a request to reset your CERES password.

Reset your password here:
${resetLink}

This link expires in 15 minutes.

If you did not request this, you can safely ignore this email.`,
    });

    return { sent: true, info };
  } catch (error) {
    const message = getEmailErrorMessage(error);
    console.error("Error sending reset password email:", message);

    return { sent: false, error: message };
  }
};
