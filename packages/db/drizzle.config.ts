import { defineConfig } from "drizzle-kit";

export const migrationsFolder = "./migrations";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema/*",
  out: migrationsFolder,
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    ...(process.env.DATABASE_DRIVER && { driver: process.env.DATABASE_DRIVER }),
  },
  verbose: true,
});