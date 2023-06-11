import type { Store } from "./store.d";

export default async function (): Promise<Store> {
  // If it's Stormkit, return the datastore
  if (process.env.STORMKIT === "true") {
    // TODO
  }

  // Otherwise fallback to sqlite3
  const { default: sqlite } = await import("./sqlite3");
  return sqlite.setup();
}
