"use client"

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { initDB } from "@/initDb";
import { PGlite } from "@electric-sql/pglite";
import { PGliteWithLive } from "@electric-sql/pglite/live";

const dbName = 'electro-drizzle';
const ELECTRIC_SQL_BASE_URL = process.env.NEXT_PUBLIC_ELECTRIC_SQL_BASE_URL || 'http://localhost:8003/v1/shape';

export default function DBProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPg] = useState<PGliteWorker>();

  const setPglite = async () => {
    const pglite = await PGliteWorker.create(
      new Worker(new URL('../workers/db.ts', import.meta.url), {
        type: 'module',
      }),
      {
        dataDir: `idb://${dbName}`,
        debug: 1,
        meta: {
          dbName,
          electricBaseUrl: ELECTRIC_SQL_BASE_URL,
        },
      }
    );
    setPg(pglite);
  }

  useEffect(() => {
    if (!pg) return;
    setPglite();
  }, [pg]);

  if (!pg) return <div>Loading</div>;

  return (
    <PGliteProvider db={pg as unknown as PGliteWithLive}>
      {children}
    </PGliteProvider>
  );
}

