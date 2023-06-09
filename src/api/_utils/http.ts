import * as http from "node:http";

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

export default {
  readBody,
  send,
};
