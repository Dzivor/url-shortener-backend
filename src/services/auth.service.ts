
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { pool } from "../db";

import {
  RegisterInput,
  LoginInput,
  User,
  JwtPayload,
} from "../types/auth.types";

import { env } from "../config/env";

const SALT_ROUNDS = 10;
export class AuthService {
  
  static async register(data: RegisterInput): Promise<User> {
  
    const { email, password } = data;

    
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    
    const result = await pool.query<User>(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
      `,
      [email, passwordHash]
    );

    
    return result.rows[0];
  }

  
  static async login(data: LoginInput): Promise<string> {
    const { email, password } = data;

    
    const result = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

  
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: "1h",
    });
  }
}
