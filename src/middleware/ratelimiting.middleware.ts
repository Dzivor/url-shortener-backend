import rateLimit from "express-rate-limit";

// Rate limiter for login attempts: 5 attempts per 15 minutes
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration attempts: 3 attempts per 15 minutes
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message:
      "Too many registration attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
