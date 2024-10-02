"use client"

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { initializeDB } from "../db"
import { PGlite } from "@electric-sql/pglite";


export default function DBProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPg] = useState<PGlite>();

  const initDB = async () => {
    try {
      const initialized = await initializeDB();
      setPg(initialized?.pg);
    } catch (error) {
      console.error("Failed to initialize db", error);
    }
  };

  useEffect(() => {
    if (pg) return;
    initDB();
  }, []);

  if (!pg) return <div>Loading</div>;

  return (
    <PGliteProvider db={pg}>
      {children}
    </PGliteProvider>
  );
}

