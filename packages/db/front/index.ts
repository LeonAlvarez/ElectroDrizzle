export { PgDialect } from 'drizzle-orm/pg-core';
import * as schema from './schema';
import { drizzle as PgLiteDrizzle } from "drizzle-orm/pglite";

import migrations from "./migrations/export.json";

export { schema };
export const frontMigrations = migrations;

export const createPgLiteClient = (client: any) => {
  return PgLiteDrizzle(client, {
    schema: schema,
  });
};

export default createPgLiteClient;