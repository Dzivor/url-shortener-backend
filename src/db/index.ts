// Database connection setup and initialization
import { Pool } from "pg";
import { env } from "../config/env";
import { runMigrations } from "./migrations";

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: env.databaseUrl,
});

// Event handler for successful database connections
pool.on("connect", () => {
  console.log("Connected to the PostgreSQL");
});

// Event handler for connection errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Initialize database and run migrations on startup
(async () => {
  try {
    // Verify database connection
    await pool.query("SELECT 1");
    console.log("Database connection verified");

    // Run pending migrations
  } catch (error) {
    console.error("Database connection or migration failed", error);
  }
})();
