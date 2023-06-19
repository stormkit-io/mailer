import type { Store } from "./store.d";
import sqlite3, { RunResult } from "sqlite3";

interface SqliteStore extends Store {
  setup(): Promise<Store>;
}

const db = new sqlite3.Database(":memory:");

function insert(template: Template): Promise<Template> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO templates
          (template_name, template_html, template_desc, default_subject, is_default)
       VALUES
          ($name, $html, $desc, $defaultSubject, $isDefault)`,
      {
        $name: template.name,
        $html: template.html,
        $desc: template.description,
        $defaultSubject: template.defaultSubject || null,
        $isDefault: template.isDefault || false,
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
}

function update(template: Template): Promise<Template> {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE templates SET
        template_name = $name,
        template_html = $html,
        template_desc = $desc,
        default_subject = $defaultSubject,
        is_default = $isDefault
      WHERE 
        rowid = $recordId;`,
      {
        $recordId: Number(template.recordId),
        $name: template.name,
        $html: template.html,
        $desc: template.description,
        $defaultSubject: template.defaultSubject || null,
        $isDefault: template.isDefault || false,
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
}

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
                default_subject TEXT NULL,
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
                rowid as recordId,
                template_name as name,
                template_html as html,
                template_desc as description,
                default_subject as defaultSubject,
                is_default as isDefault
             FROM
                templates
             LIMIT 50`,
            [],
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(rows);
            }
          );
        });
      });
    },

    byId(id: string) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<Template>(
            `SELECT
                template_name as name,
                template_html as html,
                template_desc as description,
                default_subject as defaultSubject,
                is_default as isDefault
             FROM
                templates
             WHERE rowid = $recordId
             LIMIT 50`,
            {
              $recordId: Number(id),
            },
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(rows[0] as Template);
            }
          );
        });
      });
    },

    /**
     * Insert or update the given template. If the template contains a recordId,
     * UPDATE statement will be executed, otherwise INSERT.
     */
    store(template) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          if (template.isDefault) {
            db.run(
              `UPDATE templates SET is_default = FALSE WHERE is_default = TRUE;`
            );
          }

          if (!template.recordId) {
            return insert(template).then(resolve).catch(reject);
          }

          return update(template).then(resolve).catch(reject);
        });
      });
    },

    removeById(id: string) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          return db.run(
            `DELETE FROM templates WHERE rowid = $recordId`,
            { $recordId: Number(id) },
            function (this: RunResult, err: Error | null) {
              if (err) {
                return reject(err);
              }

              return resolve({ ok: true });
            }
          );
        });
      });
    },
  },
};

export default store;
