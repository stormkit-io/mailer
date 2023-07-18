import { StatusCodes } from "http-status-codes";
import { makeRequest } from "../_utils/test_utils";
import app from "./index.post";

describe("POST /api/subscriber", () => {
  it("returns a bad request when fields are missing", async () => {
    const retVal = await makeRequest(app, { method: "POST", data: {} });

    expect(retVal).toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: "Bad Request",
      body: { errors: { email: "Email is invalid." } },
    });
  });

  it("creates a new user entity", async () => {
    const user: User = {
      email: "test@stormkit.io",
      isUnsubscribed: false,
      createdAt: Date.now(),
    };

    const retVal = await makeRequest(app, { method: "POST", data: user });

    expect(retVal).toMatchObject({
      statusCode: StatusCodes.CREATED,
      statusMessage: "Created",
      body: { user: { recordId: "1", email: "test@stormkit.io" } },
    });
  });
});
