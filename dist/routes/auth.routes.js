"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const schemas_1 = require("../schemas");
const ratelimiting_middleware_1 = require("../middleware/ratelimiting.middleware");
const router = (0, express_1.Router)();
// Register a new user with rate limiting and validation
router.post("/sign-up", ratelimiting_middleware_1.registerRateLimiter, (0, validation_middleware_1.validate)(schemas_1.registerSchema), auth_controller_1.AuthController.register);
// Login a user with rate limiting and validation
router.post("/login", ratelimiting_middleware_1.loginRateLimiter, (0, validation_middleware_1.validate)(schemas_1.loginSchema), auth_controller_1.AuthController.login);
exports.default = router;
