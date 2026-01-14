// Import bcrypt for password hashing and verification
import bcrypt from "bcrypt";
// Import jsonwebtoken for creating and signing JWT tokens
import jwt from "jsonwebtoken";
// Import database connection pool
import { pool } from "../db";
// Import TypeScript interfaces for type safety
import {
  RegisterInput,
  LoginInput,
  User,
  JwtPayload,
} from "../types/auth.types";
// Import environment configuration (contains JWT secret)
import { env } from "../config/env";

// Define the number of salt rounds for bcrypt hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

// Authentication service class with static methods for user registration and login
export class AuthService {
  // Register a new user with email and password
  static async register(data: RegisterInput): Promise<User> {
    // Destructure email and password from input data
    const { email, password } = data;

    // Hash the password using bcrypt with defined salt rounds
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user into database with email and hashed password
    const result = await pool.query<User>(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
      `,
      [email, passwordHash]
    );

    // Return the newly created user object
    return result.rows[0];
  }

  // Login a user by verifying email and password, returns JWT token
  static async login(data: LoginInput): Promise<string> {
    // Destructure email and password from input data
    const { email, password } = data;

    // Query database to find user with matching email
    const result = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    // Extract user from query result
    const user = result.rows[0];

    // Throw error if user does not exist
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    // Throw error if passwords do not match
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Create JWT payload with user information
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    // Sign and return JWT token with 1 hour expiration
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: "1h",
    });
  }
}
