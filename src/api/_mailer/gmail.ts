import nodemailer from "nodemailer";

export default {
  send: async function (emails: string[], template: string) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Savas Vedova 👻" <savas.vedova@gmail.com>',
      to: "hello@stormkit.io",
      subject: "Test email from Stormkit Mailer",
      html: "Hello <b>world</b>!",
    });

    return {
      messageId: info.messageId,
    };
  },
};
