import type { Store } from "./store.d";
import sqlite3, { RunResult } from "sqlite3";

interface SqliteStore extends Store {
  setup(): Promise<Store>;
}

const db = new sqlite3.Database(":memory:");

const store: SqliteStore = {
  setup() {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS migrations (
                migration_version INT NOT NULL DEFAULT 1,
                is_dirty BOOLEAN DEFAULT FALSE
           );`
        );

        db.run(
          `CREATE TABLE IF NOT EXISTS templates (
                template_name TEXT NOT NULL,
                template_html TEXT NOT NULL,
                template_desc TEXT NULL,
                is_default BOOLEAN DEFAULT FALSE
           );`
        );

        resolve(store);
      });
    });
  },

  templates: {
    list() {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<Template>(
            `SELECT
                template_name as name,
                template_html as html,
                template_desc as description,
                is_default as isDefault
             FROM
                templates
             LIMIT 50`,
            [],
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(
                rows.map((row) => {
                  return row;
                })
              );
            }
          );
        });
      });
    },

    store(template) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          if (template.isDefault) {
            db.run(
              `UPDATE templates SET is_default = FALSE WHERE is_default = TRUE;`
            );
          }

          db.run(
            `INSERT INTO templates
                (template_name, template_html, template_desc, is_default)
             VALUES
                ($name, $html, $desc, $isDefault)`,
            {
              $name: template.name,
              $html: template.html,
              $desc: template.description,
              $isDefault: template.isDefault,
            },
            function (this: RunResult, err: Error | null) {
              if (err) {
                return reject(err);
              }

              return resolve({
                ...template,
                recordId: this.lastID.toString(),
              });
            }
          );
        });
      });
    },
  },
};

export default store;
