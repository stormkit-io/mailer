import http from "node:http";
import { httpUtils as hu } from "./_utils";
import db from "./_db";

export default hu.app(
  async (_: http.IncomingMessage, res: http.ServerResponse) => {
    const store = await db();

    hu.send(res, {
      users: await store.users.subscribers(),
    });
  }
);
