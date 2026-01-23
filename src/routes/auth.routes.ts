import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

// Rate limiter for login attempts: 5 attempts per 15 minutes
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Register a new user
router.post("/register", AuthController.register);

// Login a user with rate limiting
router.post("/login", loginRateLimiter, AuthController.login);

export default router;
