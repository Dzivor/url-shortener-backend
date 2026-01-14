// Configures and starts the Express server on a specified port.

// Import the Express application instance
import app from "./app";
// Import environment variables (port, database URL, etc.)
import { env } from "./config/env";
// Initialize database connection
import "./db";

// Start the Express server and listen on the configured port
app.listen(env.port, () => {
  // Log a message when the server successfully starts
  console.log(`Server is running on port ${env.port}`);
});
