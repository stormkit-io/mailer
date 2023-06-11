import http from "node:http";
import { httpUtils as hu } from "./_utils";
import db from "./_db";
import defaultTemplate from "./_assets/default_template";

export default async (_: http.IncomingMessage, res: http.ServerResponse) => {
  const store = await db();
  let templates = await store.templates.list();

  if (!templates?.length) {
    templates = [defaultTemplate];
  }

  hu.send(res, {
    templates: templates.map((template) => ({
      ...template,
      variables: template.html
        .match(/\{\{\s?it\.([^\}\}]+)\}\}/g)
        ?.map((variable) =>
          variable
            // Remove {{ it. }}
            .replace(/\{\{\s?it\.|\}\}/g, "")
            // Remove filters
            .split("|")[0]
            .trim()
        )
        // This one is a special variable, it's defined by us.
        .filter((variable) => variable !== "unsubscribeUrl"),
    })),
  });
};
