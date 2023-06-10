import http from "node:http";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu } from "./_utils";

interface Body {
  token?: string;
}

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const body = await hu.readBody<Body>(req);

  if (body.token && (await hu.isAuthorized(body.token))) {
    return hu.send(res, { ok: true });
  }

  hu.send(res, { ok: false }, { status: StatusCodes.UNAUTHORIZED });
};
