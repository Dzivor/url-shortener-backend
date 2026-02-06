"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/**
 * Middleware to verify JWT token from Authorization header
 * @param req - Express request with optional user property
 * @param res - Express response object
 * @param next - Next middleware function
 * @returns Passes control to next middleware if token is valid, otherwise returns 401 error
 */
const authenticate = (req, res, next) => {
    // Extract Authorization header
    const authHeader = req.headers.authorization;
    // Check if Authorization header exists and follows Bearer token format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token missing",
        });
    }
    // Extract token from "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    try {
        // Verify token using JWT secret and cast to JwtPayload
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        // Attach decoded payload to request object
        req.user = decoded;
        // Proceed to next middleware
        next();
    }
    catch {
        // Return error if token is invalid or expired
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
