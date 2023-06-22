import type { Store } from "./store.d";
import * as sqlite3 from "sqlite3";

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
      function (this: sqlite3.RunResult, err: Error | null) {
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
      function (this: sqlite3.RunResult, err: Error | null) {
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

const queries = {
  selectUsers: `
    SELECT
      email, rowid as recordId, first_name as firstName,
      last_name as lastName, is_unsubscribed as isUnsubscribed,
      attributes
    FROM users`,

  selectTemplates: `
    SELECT
      rowid as recordId,
      template_name as name,
      template_html as html,
      template_desc as description,
      default_subject as defaultSubject,
      is_default as isDefault
    FROM
      templates`,
};

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

        db.run(
          `CREATE TABLE IF NOT EXISTS users (
            email TEXT UNIQUE NOT NULL,
            first_name TEXT NULL,
            last_name TEXT NULL,
            is_unsubscribed BOOLEAN DEFAULT FALSE,
            attributes JSONB NULL
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
            `${queries.selectTemplates} LIMIT 50`,
            [],
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(
                rows.map((row) => ({
                  ...row,
                  recordId: row.recordId?.toString(),
                }))
              );
            }
          );
        });
      });
    },

    byId(id: string) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<Template>(
            `${queries.selectTemplates} WHERE rowid = $recordId LIMIT 1;`,
            {
              $recordId: Number(id),
            },
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              rows[0].recordId = rows[0].recordId?.toString();
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
        db.serialize(async () => {
          if (template.isDefault) {
            db.run(
              `UPDATE templates SET is_default = FALSE WHERE is_default = TRUE;`
            );
          }

          if (!template.recordId) {
            return resolve(await insert(template));
          }

          return resolve(await update(template));
        });
      });
    },

    removeById(id: string) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          return db.run(
            `DELETE FROM templates WHERE rowid = $recordId`,
            { $recordId: Number(id) },
            function (this: sqlite3.RunResult, err: Error | null) {
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

  users: {
    subscribers(afterId = "0") {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<User>(
            `${queries.selectUsers}
             WHERE rowid > $recordId AND is_unsubscribed IS NOT TRUE
             ORDER BY rowid DESC LIMIT 25;`,
            { $recordId: Number(afterId) },
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(
                rows.map((row) => ({
                  ...row,
                  attributes: row.attributes
                    ? JSON.parse(row.attributes as unknown as string)
                    : {},
                  recordId: row.recordId?.toString(),
                  isUnsubscribed: Boolean(row.isUnsubscribed),
                }))
              );
            }
          );
        });
      });
    },

    list(afterId = "0") {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<User>(
            `${queries.selectUsers}
             WHERE rowid > $recordId
             ORDER BY rowid DESC LIMIT 25;`,
            { $recordId: Number(afterId) },
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(
                rows.map((row) => ({
                  ...row,
                  attributes: row.attributes
                    ? JSON.parse(row.attributes as unknown as string)
                    : {},
                  recordId: row.recordId?.toString(),
                  isUnsubscribed: Boolean(row.isUnsubscribed),
                }))
              );
            }
          );
        });
      });
    },

    listByEmail(emails) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          db.all<User>(
            `${queries.selectUsers}
             WHERE 
              email IN (${emails?.map(() => "?").join(", ")})
             ORDER BY rowid DESC LIMIT 25;`,
            emails,
            (error, rows) => {
              if (error) {
                return reject(error);
              }

              resolve(
                rows.map((row) => ({
                  ...row,
                  attributes: row.attributes
                    ? JSON.parse(row.attributes as unknown as string)
                    : {},
                  recordId: row.recordId?.toString(),
                  isUnsubscribed: Boolean(row.isUnsubscribed),
                }))
              );
            }
          );
        });
      });
    },

    store(user: User | User[]) {
      return new Promise((resolve, reject) => {
        let values: string;
        let params: any;

        if (Array.isArray(user)) {
          values = user.map(() => "(?, ?, ?, ?, ?)").join(", ");
          params = user.flatMap((u) => [
            u.email,
            u.firstName,
            u.lastName,
            u.isUnsubscribed,
            JSON.stringify(u.attributes || {}),
          ]);
        } else {
          values = `($email, $firstName, $lastName, $isUnsubscribed, $attributes)`;
          params = {
            $email: user.email,
            $firstName: user.firstName,
            $lastName: user.lastName,
            $isUnsubscribed: user.isUnsubscribed || false,
            $attributes: JSON.stringify(user.attributes || {}),
          };
        }

        db.serialize(() => {
          db.run(
            `INSERT INTO users
                (email, first_name, last_name, is_unsubscribed, attributes)
             VALUES
                ${values}`,
            params,
            function (this: sqlite3.RunResult, err: Error | null) {
              if (err) {
                return reject(err);
              }

              if (Array.isArray(user)) {
                return resolve(user);
              }

              return resolve({
                ...user,
                recordId: this.lastID.toString(),
              });
            }
          );
        });
      });
    },

    async delete(recordIds) {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          const rowIds = Array.isArray(recordIds) ? recordIds : [recordIds];
          const values = rowIds.map(() => "?").join(", ");
          const params = rowIds.flatMap((id) => [id]);

          db.run(
            `DELETE FROM users WHERE rowid IN (${values})`,
            params,
            function (this: sqlite3.RunResult, err: Error | null) {
              if (err) {
                return reject(err);
              }

              resolve({ ok: true });
            }
          );
        });
      });
    },
  },
};

export default store;
