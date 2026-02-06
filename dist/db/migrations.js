"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runMigrations() {
    const migrationsDir = path_1.default.join(__dirname, "../../migrations");
    try {
        // Create migrations table if it doesn't exist
        await index_1.pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
        // Get already executed migrations
        const { rows } = await index_1.pool.query("SELECT name FROM migrations");
        const executedMigrations = new Set(rows.map((r) => r.name));
        // Read all migration files
        const files = fs_1.default
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
            const filePath = path_1.default.join(migrationsDir, file);
            const sql = fs_1.default.readFileSync(filePath, "utf-8");
            console.log(`Running migration: ${file}`);
            await index_1.pool.query(sql);
            // Record the migration as executed
            await index_1.pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
            console.log(`Completed migration: ${file}`);
            migrationCount++;
        }
        if (migrationCount === 0) {
            console.log("No new migrations to run");
        }
        else {
            console.log(`${migrationCount} migration(s) completed successfully`);
        }
    }
    catch (error) {
        console.error("Migration failed:", error);
        throw error;
    }
}
