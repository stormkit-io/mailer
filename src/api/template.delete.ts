import http from "node:http";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu } from "./_utils";
import db from "./_db";

interface Body {
  recordId?: string;
}

export default hu.app(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const store = await db();
    const body = await hu.readBody<Body>(req);

    if (!body.recordId) {
      return hu.send(
        res,
        { error: "Missing recordId." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return hu.send(res, await store.templates.removeById(body.recordId));
  }
);
