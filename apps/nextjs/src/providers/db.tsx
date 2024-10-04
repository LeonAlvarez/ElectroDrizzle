"use client"

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { IdbFs, PGlite, PGliteInterface } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { runMigrations, syncTables } from "@/initDb";
import { electricSync } from "@electric-sql/pglite-sync";
import { vector } from "@electric-sql/pglite/vector";

const dbName = 'test';
const ELECTRIC_SQL_BASE_URL = process.env.NEXT_PUBLIC_ELECTRIC_SQL_BASE_URL;


export interface ExtendedPGlite extends PGliteInterface {
  _db?: PGliteInterface;
}

export function DbWorkerProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPg] = useState<PGliteInterface>();

  const setPglite = async () => {
    const debug = 1;
    const pglite = await PGliteWorker.create(
      new Worker(new URL('../workers/db.ts', import.meta.url), {
        type: 'module',
      }),
      {
        //dataDir: `idb://${dbName}`,
        //fs: new OpfsAhpFS('./path/to/datadir/'),
        relaxedDurability: true,
        dataDir: 'memory://',
        extensions: {
          live,
          vector,
        },
        debug,
        meta: {
          dbName,
          electricBaseUrl: ELECTRIC_SQL_BASE_URL,
        },
      }
    );

    const _db = await runMigrations(pglite, dbName);

    Object.defineProperty(pglite, '_db', {
      value: _db,
      writable: false,
    });

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
    const pglite = await PGlite.create({
      //dataDir: `idb://${dbName}`,
      relaxedDurability: true,
      dataDir: 'memory://',
      //fs: new IdbFs('my-database'),
      //fs: new OpfsAhpFS('./path/to/datadir/'),
      extensions: {
        vector,
        live,
        electric: electricSync({ debug: debug !== undefined }),
      },
      debug
    });

    const _db = await runMigrations(pglite, dbName);

    Object.defineProperty(pg, '_db', {
      value: _db,
      writable: false,
    });

    //await syncTables(pg, ELECTRIC_SQL_BASE_URL);
    pglite.electric.syncShapeToTable({
      shape: { url: `${ELECTRIC_SQL_BASE_URL}/users` },
      table: 'users',
      primaryKey: ['id'],
    });

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


