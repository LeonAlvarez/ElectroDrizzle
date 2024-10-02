
import { createPgLiteClient, schema, PgDialect, frontMigrations } from "db/front";
import { PGliteWorker } from '@electric-sql/pglite/worker'

type TablesToSync = {
  shape?: string;
  table: string;
  primaryKey?: string[];
}[]

const TablesToSync: TablesToSync = [{
  table: 'users',
  primaryKey: ['id'],
}]


export async function initDB(pg: PGliteWorker, dbName: string, electricBaseUrl: string) {
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

  const syncStart = performance.now();
  await Promise.all(TablesToSync.map(({ shape, table, primaryKey }) => {
    //@ts-ignore
    pg.electric?.syncShapeToTable({
      shape: { url: `${electricBaseUrl}/${shape || table}` },
      table,
      primaryKey: primaryKey ?? ['id'],
    });
  }));

  console.info(`✅ Local database synced in ${performance.now() - syncStart}ms`);

}