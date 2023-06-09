import http from "node:http";
import * as jwt from "jose";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu } from "./_utils";

interface Body {
  token?: string;
}

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const body = await hu.readBody<Body>(req);

  try {
    await jwt.jwtVerify(
      body?.token!,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return hu.send(res, { ok: true });
  } catch {
    hu.send(res, { ok: false }, { status: StatusCodes.UNAUTHORIZED });
  }
};
