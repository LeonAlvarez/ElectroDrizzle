import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg'

import * as schema from "./schema";
import { poolConnectionString } from "./drizzle.config";

const { PG_MAX_CLIENTS } = process.env;

export const queryClient = new pg.Pool({
  connectionString: poolConnectionString,
  ssl: process.env.PG_SSL_REQUIRE === 'true' ? true : undefined,
  max: PG_MAX_CLIENTS || 10,
});

export const db = drizzle(queryClient, { schema });

export default db;