import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const emailService = {
  async sendPasswordResetEmail(email: string, resetToken: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // Usually, the email will link to a frontend forgot password page
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
    const subject = "Password Reset - CÉRES";
    const html = `<p>You requested a password reset. Click the link below to reset your password:</p>
                  <p><a href="${resetLink}">Reset Password</a></p>
                  <p>If you didn't request this, please ignore this email.</p>`;

    if (resend) {
      try {
        await resend.emails.send({
          from: "noreply@resend.dev",
          to: email,
          subject,
          html,
        });
        console.log(`Password reset email sent to ${email}`);
      } catch (error) {
        console.error("Error sending email via Resend:", error);
      }
    } else {
      console.log(`[Email Mock] To: ${email} | Subject: ${subject}`);
      console.log(`[Email Mock] Reset Link: ${resetLink}`);
    }
  },
};
