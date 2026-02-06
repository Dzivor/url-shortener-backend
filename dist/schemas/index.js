"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// ============== Auth Schemas ==============
/**
 * Login input schema
 * Validates email and password for user login
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Please provide a valid email address" })
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password is required" }),
});
/**
 * Registration input schema
 * Validates email, password, and password confirmation
 */
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Please provide a valid email address" })
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// ============== URL Schemas ==============
/**
 * URL creation input schema
 * Validates the original URL for creating a shortened link
 */
exports.createUrlSchema = zod_1.z.object({
    originalUrl: zod_1.z
        .string()
        .url({ message: "Please provide a valid URL (include http:// or https://)" })
        .min(1, { message: "URL is required" })
        .max(2048, { message: "URL is too long" }),
});
