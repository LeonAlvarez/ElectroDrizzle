"use client"

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { initializeDB } from "../db"

export default function DBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    try {
      initializeDB().then(initializedDb => {
        console.log("db initialized", initializedDb);
        setDb(initializedDb);
      })
    } catch (error) {
      console.error("Failed to initialize db", error);
    }
  }, []);

  if (!db) return <div>Loading...</div>;

  return (
    <PGliteProvider db={db}>
      {children}
    </PGliteProvider>
  )
}

