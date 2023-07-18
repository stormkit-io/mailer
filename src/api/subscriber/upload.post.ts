import http from "node:http";
import fs from "node:fs";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu, stringUtils as su } from "../_utils";
import db from "../_db";
import formidable from "formidable";

interface Body {
  file: formidable.File;
}

export default hu.app(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { file } = await hu.readBody<Body>(req);
    const store = await db();
    const errors: Record<string, string> = {};

    if (!file) {
      errors["file"] = "File is a required field.";
    }

    if (Object.keys(errors).length > 0) {
      return hu.send(res, { errors }, { status: StatusCodes.BAD_REQUEST });
    }

    const content = fs.readFileSync(file.filepath).toString("utf-8");
    const users: User[] = [];

    content
      .split("\n")
      .slice(1)
      .forEach((row) => {
        const [email, firstName, lastName, attrs] = row.split(",");

        if (!email) {
          return;
        }

        try {
          users.push({
            email: email.replaceAll('"', ""),
            firstName,
            lastName,
            isUnsubscribed: false,
            attributes: attrs ? JSON.parse(attrs) : undefined,
            createdAt: Date.now(),
          });
        } catch {}
      });

    try {
      await store.users.store(users);
    } catch {
      return hu.send(
        res,
        { error: "Error while inserting records" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    return hu.send(
      res,
      {
        created: users.filter((u) => Boolean(u.recordId)),
        duplicate: users.filter((u) => !u.recordId),
        total: users.length,
      },
      { status: StatusCodes.CREATED }
    );
  }
);
