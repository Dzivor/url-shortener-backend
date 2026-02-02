import app from "./app";
import { env } from "./config/env";
import "./db";

// Start server on configured port
app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
