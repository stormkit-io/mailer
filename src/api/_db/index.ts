import type { Store } from "./store.d";

export default async function (): Promise<Store> {
  // If it's Stormkit, return the datastore
  if (process.env.STORMKIT === "true") {
    const { default: datastore } = await import("./datastore");
    return datastore;
  }

  // Otherwise fallback to sqlite3
  const { default: sqlite } = await import("./sqlite3");
  return sqlite.setup();
}
