"use client"

import { usePGlite } from '@electric-sql/pglite-react'
import { Repl } from '@electric-sql/pglite-repl'

export function PgRepl() {
  const pg = usePGlite()

  return (
    <>
      <Repl pg={pg} />
    </>
  )
}