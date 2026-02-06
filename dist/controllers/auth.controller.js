"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    //Handles user registration
    /**
      @param req
      @param res
      @returns
     **/
    static async register(req, res) {
        try {
            // Data is already validated by Zod middleware
            const data = req.body;
            // Call AuthService to register the user
            const user = await auth_service_1.AuthService.register(data);
            // Return success response with user details
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                },
            });
        }
        catch (error) {
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
    static async login(req, res) {
        try {
            const data = req.body;
            // Call AuthService to authenticate user and generate token
            const token = await auth_service_1.AuthService.login(data);
            return res.status(200).json({
                message: "Login successful",
                token,
            });
        }
        catch (error) {
            return res.status(401).json({
                message: error.message || "Invalid credentials",
            });
        }
    }
}
exports.AuthController = AuthController;
