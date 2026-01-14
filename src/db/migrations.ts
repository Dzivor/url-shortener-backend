import { pool } from "./index";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../../migrations");

  try {
    // Read all migration files
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
    files.sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`Completed migration: ${file}`);
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
