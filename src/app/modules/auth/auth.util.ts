import axios from 'axios';

export const getUserInfoWithToken = async (token: string) => {
  return await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const generateResetPasswordEmailHtml = (resetLink: string): string => `
  <div style="max-width: 600px; margin: 0 auto; background-color: #fffaf7; padding: 24px; font-family: 'Segoe UI', sans-serif; color: #333;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      <h1 style="margin-top: 0; color: #c41c54; font-size: 24px; text-align: center;">
        💍 Shadi Mubarak
      </h1>

      <h2 style="color: #333; font-size: 20px; margin-bottom: 16px; text-align: center;">
        Reset Your Password
      </h2>

      <p style="font-size: 15px; line-height: 1.6; text-align: center;">
        We received a request to reset your Shadi Mubarak account password.
        If this was you, please click the button below. This link is valid for the next <strong>15 minutes</strong>.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank" rel="noopener noreferrer"
           style="background-color: #c41c54; color: #ffffff; padding: 12px 28px; font-size: 16px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; text-align: center; color: #555;">
        Didn't request a password reset? No worries, just ignore this message. Your account remains secure.
      </p>

      <hr style="border: none; border-top: 1px solid #f0e6e6; margin: 40px 0;" />

      <p style="font-size: 14px; text-align: center; color: #999;">
        With love,<br/>
        <strong>Shadi Mubarak Team</strong><br/>
        <span style="font-size: 12px;">Bringing Hearts Together Since 2020</span>
      </p>
    </div>

    <p style="text-align: center; font-size: 12px; color: #bbb; margin-top: 16px;">
      &copy; ${new Date().getFullYear()} Shadi Mubarak. All rights reserved.
    </p>
  </div>
`;
