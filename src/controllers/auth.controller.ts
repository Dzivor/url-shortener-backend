import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginSchema, RegisterSchema } from "../schemas";

export class AuthController {
  //Handles user registration
  /**
    @param req 
    @param res 
    @returns 
   **/
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      // Data is already validated by Zod middleware
      const data: RegisterSchema = req.body;

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
      return res.status(400).json({
        message: error.message || "Registration failed",
      });
    }
  }

  /**
   * Handles user login
   * @param req - Express request containing validated LoginSchema data
   * @param res - Express response object
   * @returns JSON response with auth token or error message
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const data: LoginSchema = req.body;

      // Call AuthService to authenticate user and generate token
      const token = await AuthService.login(data);

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Invalid credentials",
      });
    }
  }
}
