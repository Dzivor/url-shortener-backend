import { pool } from "../db";
import crypto from "crypto";

// Service class for managing URL shortening operations and analytics
export class UrlService {
  // Generate a random 8-character hexadecimal short code for URLs
  private static md5To4Chars(url: string): string {
    return crypto.createHash("md5").update(url).digest("hex").slice(0, 4);
  }

  // Create a new shortened URL for a user, allowing multiple users to share the same short code
  static async createUrl(userId: string, originalUrl: string) {
    let shortCode: string = this.md5To4Chars(originalUrl);

    const existingUserCode = await pool.query(
      `SELECT * FROM urls WHERE user_id = $1 AND short_code = $2`,
      [userId, shortCode],
    );

    // If this user already has this short code for this URL, return existing record
    if (existingUserCode.rowCount && existingUserCode.rowCount > 0) {
      return existingUserCode.rows[0];
    }

    // Insert the new URL record into the database
    // Multiple users can have the same short code
    const result = await pool.query(
      `
      INSERT INTO urls (user_id, original_url, short_code)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, originalUrl, shortCode],
    );

    return result.rows[0];
  }

  // Retrieve a URL record by its short code
  static async findByShortCode(code: string) {
    const result = await pool.query(
      `SELECT * FROM urls WHERE short_code = $1`,
      [code],
    );
    return result.rows[0];
  }

  // Get specific URL fields (id, original_url, short_code) by short code
  static async getByShortCode(shortCode: string) {
    return await pool
      .query(
        "SELECT id, original_url, short_code FROM urls WHERE short_code = $1",
        [shortCode],
      )
      .then((result) => result.rows[0]);
  }

  // Record a click event for a URL with optional IP and user agent information
  static async recordClick(urlId: string, ip?: string, userAgent?: string) {
    await pool.query(
      `
      INSERT INTO clicks (url_id, ip_address, user_agent)
      VALUES ($1, $2, $3)
      `,
      [urlId, ip, userAgent],
    );
  }

  // Increment the click counter for a specific URL
  static async incrementClicks(urlId: number): Promise<void> {
    try {
      await pool.query("UPDATE urls SET clicks = clicks + 1 WHERE id = $1", [
        urlId,
      ]);
    } catch (error) {
      console.error("Error incrementing clicks:", error);
      throw error;
    }
  }

  // Retrieve analytics for all URLs owned by a user, including click counts
  static async getAnalytics(userId: string) {
    const result = await pool.query(
      `
      SELECT 
        u.short_code,
        u.original_url,
        COUNT(c.id)::INTEGER AS clicks
      FROM urls u
      LEFT JOIN clicks c ON c.url_id = u.id
      WHERE u.user_id = $1
      GROUP BY u.id
      `,
      [userId],
    );

    return result.rows;
  }

  // Get the original URL by its short code, returns null if not found
  static async getOriginalUrlByCode(code: string): Promise<string | null> {
    const result = await pool.query(
      `SELECT original_url FROM urls WHERE short_code = $1`,
      [code],
    );
    return result.rows[0]?.original_url ?? null;
  }
}
