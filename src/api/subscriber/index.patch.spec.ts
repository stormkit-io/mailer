import { StatusCodes } from "http-status-codes";
import { makeRequest } from "../_utils/test_utils";
import db from "../_db";
import app from "./index.post";

describe("PATCH /api/subscriber", () => {
  it("updates a user entity", async () => {
    const store = await db();
    const user: User = {
      email: "test@stormkit.io",
      isUnsubscribed: false,
      createdAt: Date.now(),
    };

    await store.users.store(user);

    const response = await makeRequest(app, { method: "PATCH", data: user });

    expect(response).toMatchObject({
      statusCode: StatusCodes.CREATED,
      body: { user },
    });
  });
});
