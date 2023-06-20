import * as http from "node:http";
import { Socket } from "node:net";
import { StatusCodes } from "http-status-codes";
import app from "./index.post";

describe("POST /api/subscriber", () => {
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

  it("returns a bad request when fields are missing", async () => {
    const wait = app(request, response);

    request.emit("data", JSON.stringify({}));
    request.emit("end");

    await wait;

    expect(writeSpy).toHaveBeenCalledWith(
      JSON.stringify({ errors: { email: "Email is a required field." } })
    );

    expect(writeHeadSpy).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      "Bad Request"
    );
  });

  it("creates a new user entity", async () => {
    const wait = app(request, response);

    request.emit("data", JSON.stringify({ email: "test@stormkit.io" }));
    request.emit("end");

    await wait;

    expect(writeSpy).toHaveBeenCalledWith(
      JSON.stringify({ user: { email: "test@stormkit.io", recordId: "1" } })
    );

    expect(writeHeadSpy).toHaveBeenCalledWith(StatusCodes.CREATED, "Created");
  });
});
