import { User } from './user.model';

export const findLastUserId = async (): Promise<string | undefined> => {
  const lastUser = await User.findOne({}, { bioDataNo: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.bioDataNo;
};

export const generateUserId = async (): Promise<string> => {
  const lastId = await findLastUserId();

  let numericPart = 0;

  if (lastId) {
    numericPart = parseInt(lastId.replace('SM-', '')) || 0;
  }

  const newIdNumber = numericPart + 1;
  const newId = `SM-${newIdNumber.toString().padStart(3, '0')}`;

  return newId;
};

export const generateVerifyEmailHtml = (resetLink: string): string => `
  <div style="max-width:600px; margin:0 auto; background-color:#fffaf7; padding:24px; font-family:'Segoe UI', sans-serif; color:#333;">
    <div style="background:#ffffff; border-radius:10px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      <h1 style="margin-top:0; color:#c41c54; font-size:24px; text-align:center;">
        💍 Shadi Mubarak
      </h1>

      <h2 style="color:#333; font-size:20px; margin-bottom:16px; text-align:center;">
        Verify Your Email Address
      </h2>

      <p style="font-size:15px; line-height:1.6; text-align:center;">
        Thank you for signing up with Shadi Mubarak. Please confirm your email address by clicking the button below.
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" target="_blank" rel="noopener noreferrer"
           style="background-color:#c41c54; color:#ffffff; padding:12px 28px; font-size:16px; border-radius:6px; text-decoration:none; display:inline-block;">
          Verify Email
        </a>
      </div>

      <p style="font-size:14px; line-height:1.6; text-align:center; color:#555;">
        Didn't request this? Just ignore the email. Your account is safe.
      </p>

      <hr style="border:none; border-top:1px solid #f0e6e6; margin:40px 0;" />

      <p style="font-size:14px; text-align:center; color:#999;">
        With love,<br/>
        <strong>Shadi Mubarak Team</strong><br/>
        <span style="font-size:12px;">Bringing Hearts Together Since 2020</span>
      </p>
    </div>

    <p style="text-align:center; font-size:12px; color:#bbb; margin-top:16px;">
      &copy; ${new Date().getFullYear()} Shadi Mubarak. All rights reserved.
    </p>
  </div>
`;
