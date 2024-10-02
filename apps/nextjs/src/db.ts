"use client"

import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { vector } from "@electric-sql/pglite/vector";
import { createPgLiteClient, schema, PgDialect, frontMigrations } from "db/front";

const isDev = process.env.NODE_ENV === "development";
const dbName = isDev ? "local-test-dev" : "local-test";

// Create an async initialization function
async function initializeDB() {
  const client = await PGlite.create({
    dataDir: `idb://${dbName}`,
    extensions: { live, vector },
  });

  const _db = createPgLiteClient(client, schema);

  // prevent multiple schema migrations to be run
  let isLocalDBSchemaSynced = false;

  console.log("isLocalDBSchemaSynced", isLocalDBSchemaSynced);
  if (!isLocalDBSchemaSynced) {
    const start = performance.now();
    try {
      await new PgDialect().migrate(
        frontMigrations,
        //@ts-ignore
        _db._.session,
        dbName
      );
      isLocalDBSchemaSynced = true;
      console.info(`✅ Local database ready in ${performance.now() - start}ms`);
    } catch (cause) {
      console.error("❌ Local database schema migration failed", cause);
      throw cause;
    }
  }

  return Object.assign(_db, { schema });
}

// Export the initialization function
export { initializeDB };