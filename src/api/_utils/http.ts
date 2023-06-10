import * as http from "node:http";
import * as jwt from "jose";

function readBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    if (req.method?.toUpperCase() === "GET" || !req.method) {
      return resolve({} as T);
    }

    req
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.isBuffer(data) ? Buffer.concat(data) : data;
        const isUrlEncoded =
          req.headers["content-type"] === "application/x-www-form-urlencoded";

        if (isUrlEncoded) {
          return resolve(
            Object.fromEntries(new URLSearchParams(body.toString("utf-8"))) as T
          );
        }

        return resolve(JSON.parse(body.toString("utf-8")));
      });
  });
}

interface SendArgs {
  headers?: http.IncomingHttpHeaders;
  status?: number;
  statusMessage?: string;
}

function send(
  res: http.ServerResponse,
  content?: Object | string,
  args?: SendArgs
) {
  args = args || {};
  args.status = args.status || 200;
  args.headers = args.headers || { "content-type": "application/json" };
  args.statusMessage = args.statusMessage || "Success";

  content = typeof content === "object" ? JSON.stringify(content) : content;

  Object.keys(args.headers || {}).forEach((key) => {
    res.setHeader(key, args?.headers![key]!);
  });

  res.writeHead(args.status, args.statusMessage);
  res.write(content);
  res.end();
}

/**
 * Checks whether the user is authorized or not. Pass either a
 * token or a http headers as an argument.
 */
async function isAuthorized(
  tokenOrHeaders: string | http.IncomingHttpHeaders
): Promise<boolean> {
  let token: string | void;

  if (typeof tokenOrHeaders !== "string") {
    token = extractBearerToken(tokenOrHeaders);
  } else {
    token = tokenOrHeaders;
  }

  if (!token) {
    return false;
  }

  try {
    await jwt.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return true;
  } catch {
    return false;
  }
}

/**
 * Helper function to extract the bearer token from the request headers.
 */
function extractBearerToken(headers: http.IncomingHttpHeaders): string | void {
  const auth = headers["authorization"];

  if (!auth) {
    return;
  }

  const [authType, token] = auth.split(" ");

  switch (authType.toLowerCase()) {
    case "bearer":
      return token;
    default:
      return;
  }
}

export default {
  isAuthorized,
  readBody,
  send,
};
