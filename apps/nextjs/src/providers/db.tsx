"use client"

import React, { createContext, useEffect, useState } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react"

const DBContext = createContext({})

export default function DBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any | null>(null)

  const initDB = async () => {
    try {
      const { PGlite } = await import("@electric-sql/pglite")

      const db = await PGlite.create()
      setDb(db);
    } catch (error) {
      console.error("Failed to initialize PGlite:", error)
    }
  }

  useEffect(() => {
    initDB()
  }, [])

  if (!db) return <div>Loading...</div>;

  return (
    <PGliteProvider db={db}>
      <DBContext.Provider value={{}}>
        {children}
      </DBContext.Provider>
    </PGliteProvider>
  )
}

