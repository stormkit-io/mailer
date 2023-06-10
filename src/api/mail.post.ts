import http from "node:http";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu } from "./_utils";
import Gmail from "./_mailer/gmail";

interface Body {
  templateId?: string;
  email: string | string[];
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

async function mailer(emails: string[], templateId: string) {
  const template = "";

  if (process.env.GMAIL_USERNAME && process.env.GMAIL_PASSWORD) {
    return Gmail.send(emails, template);
  }
}

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
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

  if (Object.keys(errors).length > 0) {
    return hu.send(res, { errors }, { status: StatusCodes.BAD_REQUEST });
  }

  try {
    hu.send(res, await mailer(emails, body.templateId!));
  } catch (e) {
    hu.send(
      res,
      { error: (e as Error).message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
