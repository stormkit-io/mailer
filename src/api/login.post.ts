import http from "node:http";
import * as jwt from "jose";
import { StatusCodes } from "http-status-codes";
import { httpUtils as hu } from "./_utils";

interface Body {
  username?: string;
  password?: string;
}

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const body = await hu.readBody<Body>(req);

  if (
    body.password === process.env.ADMIN_PASSWORD &&
    body.username === process.env.ADMIN_USERNAME
  ) {
    const jwtToken = await new jwt.SignJWT({
      session: true,
    })
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return hu.send(res, { token: jwtToken });
  }

  hu.send(res, { ok: false }, { status: StatusCodes.UNAUTHORIZED });
};
