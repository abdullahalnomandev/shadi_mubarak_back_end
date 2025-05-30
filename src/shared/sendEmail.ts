import nodemailer from "nodemailer";
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.env === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mezbaul@programming-hero.com',
      pass: 'xfqj dshz wdui ymtb',
    },
  });

  await transporter.sendMail({
    from: 'mezbaul@programming-hero.com',
    to, 
    subject: 'Reset your password within ten mins!',
    text: '', 
    html,
  });
};