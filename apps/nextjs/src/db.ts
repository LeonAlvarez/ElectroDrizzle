"use client"

import { live } from "@electric-sql/pglite/live";
import { vector } from "@electric-sql/pglite/vector";
import { createPgLiteClient, schema, PgDialect, frontMigrations } from "db/front";
import { PGlite } from "@electric-sql/pglite";
import { electricSync } from '@electric-sql/pglite-sync'

const isDev = process.env.NODE_ENV === "development";
const dbName = isDev ? "local-test-dev" : "local-test";

const ELECTRIC_SQL_BASE_URL = process.env.NEXT_PUBLIC_ELECTRIC_SQL_BASE_URL || 'http://localhost:8003/v1/shape';

type TablesToSync = {
  shape?: string;
  table: string;
  primaryKey?: string[];
}[]

const TablesToSync: TablesToSync = [{
  table: 'users',
  primaryKey: ['id'],
}]

// Create an async initialization function
async function initializeDB(pg?: PGlite) {
  try {
    pg ??= new PGlite({
      dataDir: `idb://${dbName}`,
      extensions: {
        live,
        vector,
        electric: electricSync({ debug: true }),
      },
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

    await Promise.all(TablesToSync.map(({ shape, table, primaryKey }) => {
      //@ts-ignore
      pg.electric?.syncShapeToTable({
        shape: { url: `${ELECTRIC_SQL_BASE_URL}/${shape || table}` },
        table,
        primaryKey: primaryKey ?? ['id'],
      });
    }));

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