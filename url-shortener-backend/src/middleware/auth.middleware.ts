import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth.types";

/**
 * Extended Request interface that includes optional user payload
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware to verify JWT token from Authorization header
 * @param req - Express request with optional user property
 * @param res - Express response object
 * @param next - Next middleware function
 * @returns Passes control to next middleware if token is valid, otherwise returns 401 error
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    // Attach decoded payload to request object
    req.user = decoded;
    // Proceed to next middleware
    next();
  } catch {
    // Return error if token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
