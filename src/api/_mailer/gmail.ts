import nodemailer from "nodemailer";

export default {
  send: async function (emails: string[], template: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAILER_FROM_ADDR,
      to: "hello@stormkit.io",
      subject: "Test email from Stormkit Mailer",
      html: "Hello <b>world</b>!",
    });

    return {
      messageId: info.messageId,
    };
  },
};
