"use client"

import { live } from "@electric-sql/pglite/live";
import { vector } from "@electric-sql/pglite/vector";
import { createPgLiteClient, schema, PgDialect, frontMigrations } from "db/front";
import { PGlite } from "@electric-sql/pglite";

const isDev = process.env.NODE_ENV === "development";
const dbName = isDev ? "local-test-dev" : "local-test";

// Create an async initialization function
async function initializeDB(pg?: PGlite) {
  try {
    pg ??= new PGlite({
      dataDir: `idb://${dbName}`,
      extensions: { live, vector },
      //debug: 1
    });
    
    const db = createPgLiteClient(pg, schema);

    //prevent multiple schema migrations to be run
    let isLocalDBSchemaSynced = false;

    console.log("isLocalDBSchemaSynced", isLocalDBSchemaSynced);
    if (!isLocalDBSchemaSynced) {
      const start = performance.now();
      try {
        await new PgDialect().migrate(
          frontMigrations,
          //@ts-ignore
          db._.session,
          dbName
        );
        isLocalDBSchemaSynced = true;
        console.info(`✅ Local database ready in ${performance.now() - start}ms`);
      } catch (cause) {
        console.error("❌ Local database schema migration failed", cause);
        throw cause;
      }
    }

    return {
      pg,
      db,
      schema
    }

  } catch (e) {
    console.error("Failed to initialize db", e);
  }
}

// Export the initialization function
export { initializeDB };