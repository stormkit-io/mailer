import { StatusCodes } from "http-status-codes";
import { makeRequest } from "./_utils/test_utils";
import app from "./subscribers.get";
import db from "./_db";

describe("GET /api/subscribers", () => {
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

      const retVal = await makeRequest(app);

      expect(retVal).toMatchObject({
        statusCode: StatusCodes.OK,
        statusMessage: "Success",
        body: { users: [users[0]] },
      });
    });
  });
});
