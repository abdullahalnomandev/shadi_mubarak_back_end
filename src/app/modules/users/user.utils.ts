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
        💍  বিয়ের ঠিকানা
      </h1>

      <h2 style="color:#333; font-size:20px; margin-bottom:16px; text-align:center;">
        আপনার ইমেইল ঠিকানা নিশ্চিত করুন
      </h2>

      <p style="font-size:15px; line-height:1.6; text-align:center;">
        আপনি বিয়ের ঠিকানা সাইটে সাইন আপ করেছেন। আপনার ইমেইল ঠিকানা নিশ্চিত করার জন্য নিচের বাটনে ক্লিক করুন।
        এই লিঙ্কটি <strong>১৫ মিনিট</strong> পরে বাতিল হয়।
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" target="_blank" rel="noopener noreferrer "
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
        onmouseup="this.style.transform='scale(1)';"">
          ইমেইল ভেরিফিকেশন নিশ্চিত করুন
        </a>
      </div>

      <p style="font-size:14px; line-height:1.6; text-align:center; color:#555;">
        আপনি যদি এই ইমেইলের জন্য আবেদন না করে থাকেন? ইমেইলটি উপেক্ষা করুন। আপনার একাউন্ট নিরাপদ আছে।
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
