import * as http from "node:http";
import { Socket } from "node:net";

interface Opts {
  method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT" | "HEAD";
  data?: unknown;
}

/**
 * This is a helper function to prepare the request for tests.
 *
 * Usage:
 *
 * ```
 * import app from "./index.post.ts";
 *
 * // ...
 *
 * it("", async () => {
 *   const options = {};
 *   await makeRequest(app, options);
 * })
 * ```
 */
export const makeRequest = async (
  app: (req: http.IncomingMessage, res: http.ServerResponse) => void,
  options?: Opts
) => {
  const request = new http.IncomingMessage(new Socket());
  const response = new http.ServerResponse(request);

  if (options?.method) {
    request.method = options.method;
  }

  const writeSpy = jest.spyOn(response, "write");

  const retVal: {
    statusCode?: number;
    statusMessage?: string;
    body?: string;
  } = {};

  app(request, response);

  if (options?.data) {
    request.emit("data", JSON.stringify(options?.data));
    request.emit("end");
  }

  await Promise.all([
    new Promise((resolve) => {
      writeSpy.mockImplementation((chunk, _, __) => {
        retVal.statusCode = response.statusCode;
        retVal.statusMessage = response.statusMessage;

        try {
          retVal.body = JSON.parse(chunk);
        } catch {
          retVal.body = chunk;
        }
        resolve(true);
        return true;
      });
    }),
  ]);

  return retVal;
};
