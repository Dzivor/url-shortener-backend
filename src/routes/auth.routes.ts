import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../schemas";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../middleware/ratelimiting.middleware";

const router = Router();

// Register a new user with rate limiting and validation
router.post(
  "/sign-up",
  registerRateLimiter,
  validate(registerSchema),
  AuthController.register,
);

// Login a user with rate limiting and validation
router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  AuthController.login,
);

export default router;
