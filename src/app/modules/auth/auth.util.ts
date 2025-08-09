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
        💍  বিয়ের ঠিকানা

      </h1>

      <h2 style="color: #333; font-size: 20px; margin-bottom: 16px; text-align: center;">
        আপনার পাসওয়ার্ড রিসেট করুন
      </h2>

      <p style="font-size: 15px; line-height: 1.6; text-align: center;">
        আপনি বিয়ের ঠিকানা সাইন আপ করেছেন। আপনার পাসওয়ার্ড রিসেট করার জন্য নিচের বাটনে ক্লিক করুন।
        এই লিঙ্কটি <strong>১৫ মিনিট</strong> পরে বাতিল হয়।
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank" rel="noopener noreferrer"
           style="
          background: linear-gradient(to right, #ec4899, #f43f5e);
          color: #ffffff;
          padding: 12px 28px;
          font-size: 16px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          font-weight: 600;
          box-shadow: 0 10px 15px -3px rgba(236,72,153,0.4), 0 4px 6px -2px rgba(244,63,94,0.4);
          transition: all 0.3s ease;
        "
        onmouseover="this.style.background='linear-gradient(to right, #db2777, #e11d48)'; this.style.boxShadow='0 15px 20px rgba(219,39,119,0.6)'; this.style.transform='scale(1.05)';"
        onmouseout="this.style.background='linear-gradient(to right, #ec4899, #f43f5e)'; this.style.boxShadow='0 10px 15px -3px rgba(236,72,153,0.4), 0 4px 6px -2px rgba(244,63,94,0.4)'; this.style.transform='scale(1)';"
        onmousedown="this.style.transform='scale(0.98)';"
        onmouseup="this.style.transform='scale(1)';">
          পাসওয়ার্ড পরিবর্তন করুন
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; text-align: center; color: #555;">
        আপনি পাসওয়ার্ড পরিবর্তনের জন্য অনুরোধ না করেছেন? কোন সমস্যা নেই। এই মেসেজটি উপেক্ষা করুন। আপনার একাউন্ট নিরাপদ থাকে।
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
