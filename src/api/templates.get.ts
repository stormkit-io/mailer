import http from "node:http";
import { httpUtils as hu } from "./_utils";
import db from "./_db";
import defaultTemplate from "./_assets/default_template";

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const store = await db();
  let templates = await store.templates.list();

  if (!templates?.length) {
    templates = [defaultTemplate];
  }

  hu.send(res, { templates });
};
