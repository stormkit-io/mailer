import type { Store } from "./store.d";
import ds from "@stormkit/ds";

const store: Store = {
  templates: {
    async list() {
      return ds.fetch<Template>("templates", {});
    },

    async byId(recordId: string) {
      return ds.fetchOne<Template>("templates", { recordId });
    },

    async store(template: Template) {
      const result = await ds.store("templates", template, {
        unique: ["name"],
      });

      template.recordId = result.recordIds?.[0];
      return template;
    },
  },
};

export default store;
