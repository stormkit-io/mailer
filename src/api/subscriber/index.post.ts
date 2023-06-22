import http from "node:http";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu, stringUtils as su } from "../_utils";
import db from "../_db";

export default hu.app(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const user = await hu.readBody<User>(req);
    const store = await db();
    const errors: Record<string, string> = {};

    if (!user.email?.trim()) {
      errors["email"] = "Email is a required field.";
    }

    if (!su.isValidEmail(user.email)) {
      errors["email"] = "Email is invalid.";
    }

    const fields: Array<keyof User> = ["firstName", "lastName"];

    fields.forEach((key) => {
      if (user[key] && typeof user[key] !== "string") {
        errors[key] = `${key} has to be a string.`;
      }
    });

    if (user.attributes && typeof user.attributes !== "object") {
      errors["attributes"] = "Attributes has to be a Record<string, any>.";
    }

    if (Object.keys(errors).length > 0) {
      return hu.send(res, { errors }, { status: StatusCodes.BAD_REQUEST });
    }

    return hu.send(
      res,
      {
        user: await store.users.store({
          recordId: user.recordId,
          email: user.email.trim(),
          firstName: user.firstName?.trim(),
          lastName: user.lastName?.trim(),
          isUnsubscribed: user.isUnsubscribed,
          attributes: user.attributes,
        }),
      },
      { status: StatusCodes.CREATED }
    );
  }
);
