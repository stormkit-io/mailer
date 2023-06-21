import type { Store } from "./store.d";
import ds from "@stormkit/ds";

const store: Store = {
  templates: {
    async list() {
      return ds.fetch<Template>("templates", {}, { limit: 25, sortDir: "ASC" });
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

    async removeById(recordId: string) {
      return await ds.removeByRecordId(recordId);
    },
  },

  users: {
    async subscribers(afterId = "0") {
      return await ds.fetch<User>(
        "users",
        { recordId: { ">": afterId }, isUnsubscribed: { "!=": true } },
        { sortDir: "DESC", limit: 25 }
      );
    },

    async list(afterId = "0") {
      return await ds.fetch<User>(
        "users",
        { recordId: { ">": afterId } },
        { sortDir: "DESC", limit: 25 }
      );
    },

    async listByEmail(emails) {
      return await ds.fetch<User>(
        "users",
        { email: { in: emails } },
        { sortDir: "DESC", limit: 25 }
      );
    },

    async store(user: User) {
      try {
        const result = await ds.store("users", user, {
          unique: ["email"],
        });

        if (Array.isArray(user)) {
          user.forEach((u, i) => {
            u.recordId = result.recordIds?.[i];
          });
        } else {
          user.recordId = result.recordIds?.[0];
        }
      } catch {}

      return user;
    },

    async delete(recordIds) {
      return await ds.removeByRecordId(recordIds);
    },
  },
};

export default store;
