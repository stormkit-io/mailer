import http from "node:http";
import { httpUtils as hu } from "./_utils";
import db from "./_db";
import defaultTemplate from "./_assets/default-template";

export default async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const store = await db();
  let templates = await store.templates.list();

  if (!templates?.length) {
    templates = [
      {
        recordId: "fallback",
        name: "Standard Template",
        description: "Default template that will be used to send emails.",
        html: defaultTemplate,
        isDefault: true,
      },
    ];
  }

  hu.send(res, { templates });
};
