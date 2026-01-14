//Setting up and exporting a PostgreSQL database connection pool.

// Importing necessary modules
import { Pool } from "pg";
import { env } from "../config/env";
import { runMigrations } from "./migrations";

// Creating a new database connection pool
export const pool = new Pool({
  connectionString: env.databaseUrl,
});

// Event listener for successful connection
pool.on("connect", () => {
  console.log("Connected to the PostgreSQL");
});

// Event listener for errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Forcing an iniitial connection to verify database connectivity and run migrations

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection verified");
    
    // Run migrations
    await runMigrations();
  } catch (error) {
    console.error("Database connection or migration failed", error);
  }
})();
