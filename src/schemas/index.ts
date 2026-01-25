import { z } from "zod";

// ============== Auth Schemas ==============

/**
 * Login input schema
 * Validates email and password for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Registration input schema
 * Validates email, password, and password confirmation
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;

// ============== URL Schemas ==============

/**
 * URL creation input schema
 * Validates the original URL for creating a shortened link
 */
export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .url({ message: "Please provide a valid URL (include http:// or https://)" })
    .min(1, { message: "URL is required" })
    .max(2048, { message: "URL is too long" }),
});

export type CreateUrlSchema = z.infer<typeof createUrlSchema>;

