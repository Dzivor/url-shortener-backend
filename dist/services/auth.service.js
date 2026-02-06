"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const env_1 = require("../config/env");
const SALT_ROUNDS = 10;
class AuthService {
    static async register(data) {
        const { email, password } = data;
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const result = await db_1.pool.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
      `, [email, passwordHash]);
        return result.rows[0];
    }
    static async login(data) {
        const { email, password } = data;
        const result = await db_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
        if (!passwordMatch) {
            throw new Error("Invalid credentials");
        }
        const payload = {
            userId: user.id,
            email: user.email,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, {
            expiresIn: "1h",
        });
    }
}
exports.AuthService = AuthService;
