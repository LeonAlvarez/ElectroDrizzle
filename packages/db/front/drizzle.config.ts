import { defineConfig } from "drizzle-kit";
import { drizzleConfig } from "../drizzle.config";

export const migrationsFolder = `./front/migrations`;

export default defineConfig({
  ...drizzleConfig,
  schema: `./front/schema.ts`,
  out: migrationsFolder,
  verbose: true,
});
