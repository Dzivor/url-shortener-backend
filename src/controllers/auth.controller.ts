import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../types/auth.types";

export class AuthController {
  /**
   * Handles user registration
   * @param req - Express request containing RegisterInput data
   * @param res - Express response object
   * @returns JSON response with user data or error message
   */
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const data: RegisterInput = req.body;

      // Call AuthService to register the user
      const user = await AuthService.register(data);

      // Return success response with user details
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
      });
    } catch (error: any) {
      // Return error response if registration fails
      return res.status(400).json({
        message: error.message || "Registration failed",
      });
    }
  }

  /**
   * Handles user login
   * @param req - Express request containing LoginInput data
   * @param res - Express response object
   * @returns JSON response with auth token or error message
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const data: LoginInput = req.body;

      // Call AuthService to authenticate user and generate token
      const token = await AuthService.login(data);

      // Return success response with JWT token
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      // Return error response if login fails
      return res.status(401).json({
        message: error.message || "Invalid credentials",
      });
    }
  }
}
