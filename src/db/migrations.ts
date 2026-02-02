import { pool } from "./index";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../../migrations");

  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Get already executed migrations
    const { rows } = await pool.query("SELECT name FROM migrations");
    const executedMigrations = new Set(rows.map((r) => r.name));

    // Read all migration files
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"));
    files.sort();

    let migrationCount = 0;

    for (const file of files) {
      // Skip if migration already executed
      if (executedMigrations.has(file)) {
        console.log(`Skipping migration: ${file} (already executed)`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);
      await pool.query(sql);

      // Record the migration as executed
      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      console.log(`Completed migration: ${file}`);

      migrationCount++;
    }

    if (migrationCount === 0) {
      console.log("No new migrations to run");
    } else {
      console.log(`${migrationCount} migration(s) completed successfully`);
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
