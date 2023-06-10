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

    let messageIds = [];

    for (let email of emails) {
      messageIds.push(
        await transporter.sendMail({
          from: process.env.MAILER_FROM_ADDR,
          to: email,
          subject: "Test email from Stormkit Mailer",
          html: "Hello <b>world</b>!",
        })
      );
    }

    return {
      messageIds,
    };
  },
};
