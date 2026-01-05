// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
// Load environment variables from .env file into process.env
dotenv.config();

// Export environment configuration object with typed properties
export const env = {
  // Server port from environment or default to 5000
  port: process.env.PORT || 5000,
  // Database connection URL from environment variables (required)
  databaseUrl: process.env.DATABASE_URL as string,
  // JWT secret key for signing authentication tokens (required)
  jwtSecret: process.env.JWT_SECRET as string,
};
// Log the database URL for debugging purposes
console.log("DATABASE_URL:", process.env.DATABASE_URL);
