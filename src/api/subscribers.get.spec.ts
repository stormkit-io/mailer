import * as http from "node:http";
import { Socket } from "node:net";
import { StatusCodes } from "http-status-codes";
import app from "./subscribers.get";
import db from "./_db";

describe("GET /api/subscribers", () => {
  let request: http.IncomingMessage;
  let response: http.ServerResponse;
  let writeSpy: jest.SpyInstance;
  let writeHeadSpy: jest.SpyInstance;

  beforeEach(() => {
    request = new http.IncomingMessage(new Socket());
    response = new http.ServerResponse(request);
    request.method = "POST";

    writeHeadSpy = jest.spyOn(response, "writeHead");
    writeSpy = jest.spyOn(response, "write");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("using sqlite", () => {
    it("returns a list of users", async () => {
      const users: User[] = [
        {
          recordId: "1",
          email: "joe@doe.com",
          firstName: "joe",
          lastName: "doe",
          attributes: {
            package: "free-tier",
          },
          isUnsubscribed: false,
        },
        {
          recordId: "2",
          email: "jane@doe.com",
          firstName: "jane",
          lastName: "doe",
          attributes: {
            package: "enterprise",
          },
          isUnsubscribed: true,
        },
      ];

      const store = await db();

      await store.users.store(users);
      await app(request, response);

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0])).toEqual({
        users: [users[0]],
      });

      expect(writeHeadSpy).toHaveBeenCalledWith(StatusCodes.OK, "Success");
    });
  });
});
