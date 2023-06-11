import http from "node:http";
import { httpUtils as hu } from "./_utils";
import db from "./_db";

interface Body {
  templateName?: string;
  templateHtml?: string;
}

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const body = await hu.readBody<Body>(req);
  const store = await db();

  console.log(
    await store.templates.store({
      name: "My template",
      html: "<b>Hello world: {{ name }}</b>",
      description: "Default template",
      isDefault: true,
    })
  );

  hu.send(res, { ok: true });
};
