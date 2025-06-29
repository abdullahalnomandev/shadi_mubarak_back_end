import nodemailer from 'nodemailer';
import config from '../config';

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  text = '',
}: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.smtp_host,
    port: 587,
    secure: config.env === 'production',
    auth: {
      user: config.smtp.smtp_user,
      pass: config.smtp.smtp_pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Shadi Mubarak" <${config.smtp.smtp_user}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new Error('Failed to send email');
  }
};
