import fs from "node:fs/promises";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { migrationsFolder } from "./drizzle.config";

const clientmigrationsFolder = `${migrationsFolder}/../client/migrations`;
const file = `${clientmigrationsFolder}/export.json`;

await fs.writeFile(
  `${file}`,
  JSON.stringify(
    readMigrationFiles({
      migrationsFolder,
    }),
    null,
    0
  ),
  {
    flag: "w",
  }
);