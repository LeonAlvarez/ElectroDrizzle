import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";
import { vector } from "@electric-sql/pglite/vector";
import { PGliteWorkerOptions, worker } from '@electric-sql/pglite/worker'

worker({
  async init(options: PGliteWorkerOptions) {
    const pg = await PGlite.create({
      dataDir: options.dataDir,
      extensions: {
        live,
        vector,
        electric: electricSync({ debug: options?.debug !== undefined }),
      },
      debug: options.debug
    });

    return pg;
  }
});