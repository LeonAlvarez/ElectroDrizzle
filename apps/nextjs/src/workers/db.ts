import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { vector } from "@electric-sql/pglite/vector";
import { PGliteWorkerOptions, worker } from '@electric-sql/pglite/worker'
import { runMigrations, syncTables } from "@/initDb";

worker({
  async init(options: PGliteWorkerOptions) {
    const pg = await PGlite.create({
      dataDir: options.dataDir,
      extensions: {
        vector,
        electric: electricSync({ debug: options?.debug !== undefined }),
      },
      debug: options.debug
    });

    //await runMigrations(pg, options.meta.dbName);
    //await syncTables(pg, options.meta.electricBaseUrl);
    
    await pg.electric.syncShapeToTable({
      shape: { url: `${options.meta.electricBaseUrl}/users` },
      table: 'users',
      primaryKey: ['id'],
    });

    return pg;
  }
}); 