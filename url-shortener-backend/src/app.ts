import express from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import redirectRoutes from "./routes/redirect.routes";

const app = express();
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Global middleware
app.use(express.json());

// JSON parsing error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({ message: "Invalid JSON" });
    }
    next(err);
  }
);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);

import urlRoutes from "./routes/url.routes";

app.use("/api", urlRoutes);

app.use("/", redirectRoutes);

export default app;
