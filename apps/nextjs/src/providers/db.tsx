"use client"

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite, PGliteInterface } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { runMigrations, syncTables } from "@/initDb";
import { electricSync } from "@electric-sql/pglite-sync";

const dbName = 'electro-drizzle';
const ELECTRIC_SQL_BASE_URL = process.env.NEXT_PUBLIC_ELECTRIC_SQL_BASE_URL || 'http://localhost:8003/v1/shape';

export function DbWorkerProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPg] = useState<PGliteInterface>();

  const setPglite = async () => {
    const debug = 1;
    const pglite = await PGliteWorker.create(
      new Worker(new URL('../workers/db.ts', import.meta.url), {
        type: 'module',
      }),
      {
        dataDir: `idb://${dbName}`,
        extensions: {
          live,
          //electric: electricSync({ debug: debug !== undefined }),
        },
        debug,
        meta: {
          dbName,
          electricBaseUrl: ELECTRIC_SQL_BASE_URL,
        },
      }
    );

    setPg(pglite);
  }

  useEffect(() => {
    if (pg) return;
    setPglite();
  }, [pg]);

  if (!pg) return <div>Loading</div>;

  return (
    <PGliteProvider db={pg}>
      {children}
    </PGliteProvider>
  );
}

export function DbProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPg] = useState<PGliteInterface>();

  const setPglite = async () => {
    const debug = 1;
    const pg = await PGlite.create({
      dataDir: `idb://${dbName}`,
      extensions: {
        live,
        electric: electricSync({ debug: debug !== undefined }),
      },
      debug
    });

    await runMigrations(pg, dbName);
    await syncTables(pg, ELECTRIC_SQL_BASE_URL);

    // await pg.electric.syncShapeToTable({
    //   shape: { url: `${options.meta.electricBaseUrl}/users` },
    //   table: 'users',
    //   primaryKey: ['id'],
    // });

    setPg(pg);
  }

  useEffect(() => {
    if (pg) return;
    setPglite();
  }, [pg]);

  if (!pg) return <div>Loading</div>;

  return (
    <PGliteProvider db={pg}>
      {children}
    </PGliteProvider>
  );
}


