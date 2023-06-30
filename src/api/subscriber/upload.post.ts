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

    return hu.send(
      res,
      {
        content: fs.readFileSync(file.filepath).toString("utf-8"),
      },
      { status: StatusCodes.CREATED }
    );
  }
);
