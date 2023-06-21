import http from "node:http";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu, stringUtils as su } from "../_utils";
import db from "../_db";

interface Body {
  recordIds?: string[];
}

export default hu.app(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { recordIds } = await hu.readBody<Body>(req);
    const store = await db();
    const errors: Record<string, string> = {};

    if (!recordIds || !Array.isArray(recordIds) || recordIds?.length === 0) {
      errors["recordIds"] = "Record ids need to be an array of strings.";
    }

    if (Object.keys(errors).length > 0) {
      return hu.send(res, { errors }, { status: StatusCodes.BAD_REQUEST });
    }

    return hu.send(res, await store.users.delete(recordIds!), {
      status: StatusCodes.CREATED,
    });
  }
);
