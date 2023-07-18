import http from "node:http";
import * as Sqry from "squirrelly";
import { StatusCodes } from "http-status-codes";
import db from "./_db";
import defaultTemplate from "./_assets/default_template";
import { httpUtils as hu } from "./_utils";
import SMTP from "./_mailer/smtp";

interface Body {
  templateId?: string;
  subject?: string;
  email: string | string[];
  data?: Record<string, string>;
}

function validEmails(email: string | string[]): string[] {
  const emails = Array.isArray(email) ? email : [email];

  return emails.filter((e) => {
    if (typeof e !== "string") {
      return false;
    }

    const atIndex = e.indexOf("@");

    return atIndex > 0 && e.indexOf(".", atIndex) > -1;
  });
}

interface MailerProps {
  emails: string[];
  subject?: string;
  templateId: string;
  data?: Record<string, string>;
}

async function mailer(props: MailerProps) {
  const store = await db();

  const template =
    (await store.templates.byId(props.templateId)) || defaultTemplate;

  const html = props.data
    ? Sqry.render(template.html, props.data)
    : template.html;

  const subject =
    props.subject ||
    template.defaultSubject ||
    "Test email from Stormkit Mailer";

  if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
    return SMTP.send({ emails: props.emails, html, subject });
  }
}

export default hu.app(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const body = await hu.readBody<Body>(req);
    const errors: Record<string, string> = {};

    if (typeof body.templateId !== "string" || !body.templateId) {
      errors["templateId"] = "The template ID should be a non-empty string.";
    }

    const emails = validEmails(body.email);

    if (!emails.length) {
      errors["email"] =
        "Email should be either a valid email string or an array of valid emails.";
    }

    if (emails.length > 20) {
      errors["email"] =
        "You can send maximum to 20 emails using this endpoint. Try using lists for a larger request.";
    }

    if (Object.keys(errors).length > 0) {
      return hu.send(res, { errors }, { status: StatusCodes.BAD_REQUEST });
    }

    const store = await db();
    const users = await store.users.listByEmail(emails);
    const unsubscribed = users.reduce((obj: Record<string, boolean>, u) => {
      obj[u.email.toLowerCase()] = u.isUnsubscribed || false;
      return obj;
    }, {});

    const newUsers: User[] = [];

    // Filter unsubscribed users to prevent SPAM.
    const filteredEmails = emails.filter((email) => {
      const lowerCaseEmail = email.toLowerCase();
      const isUnsubscribed = unsubscribed[lowerCaseEmail];

      if (isUnsubscribed) {
        return false;
      }

      // New user, insert into DB
      if (typeof isUnsubscribed === "undefined") {
        newUsers.push({
          email: lowerCaseEmail,
          isUnsubscribed: false,
          createdAt: Date.now(),
        });
      }

      return true;
    });

    if (newUsers.length > 0) {
      await store.users.store(newUsers);
    }

    try {
      hu.send(res, {
        ...(await mailer({
          emails: filteredEmails,
          templateId: body.templateId!,
          data: body.data,
          subject: body.subject,
        })),
        newUsers,
        emails: filteredEmails,
      });
    } catch (e) {
      hu.send(
        res,
        { error: (e as Error).message },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  }
);
