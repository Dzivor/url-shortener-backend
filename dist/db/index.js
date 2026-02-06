"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// Database connection setup and initialization
const pg_1 = require("pg");
const env_1 = require("../config/env");
// Create PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.databaseUrl,
});
// Event handler for successful database connections
exports.pool.on("connect", () => {
    console.log("Connected to the PostgreSQL");
});
// Event handler for connection errors
exports.pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
// Initialize database and run migrations on startup
(async () => {
    try {
        // Verify database connection
        await exports.pool.query("SELECT 1");
        console.log("Database connection verified");
        // Run pending migrations
    }
    catch (error) {
        console.error("Database connection or migration failed", error);
    }
})();
