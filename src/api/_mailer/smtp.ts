import nodemailer from "nodemailer";
import defaultTemplate from "../_assets/default_template";

export interface SendProps {
  emails: string[];
  html: string;
  subject: string;
}

export default {
  send: async function ({ emails, subject, html }: SendProps) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let messageIds = [];

    for (let email of emails) {
      messageIds.push(
        await transporter.sendMail({
          from: process.env.MAILER_FROM_ADDR,
          to: email,
          html,
          subject,
        })
      );
    }

    return {
      messageIds,
    };
  },
};
