export { PgDialect } from 'drizzle-orm/pg-core';
export * as schema from './schema';
import { drizzle as PgLiteDrizzle } from "drizzle-orm/pglite";
import { users, posts } from './schema';

export const createPgLiteClient = (client: any, customSchema?: any) => {
  return PgLiteDrizzle(client, {
    schema: customSchema || { ...users, ...posts },
  });
};

export default createPgLiteClient;