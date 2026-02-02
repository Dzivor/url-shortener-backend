import { Request, Response } from "express";
import { UrlService } from "../services/url.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { CreateUrlSchema } from "../schemas";

// Controller for handling URL shortening, analytics, and redirects
export class UrlController {
  // Create a new shortened URL for authenticated user
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { originalUrl }: CreateUrlSchema = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const url = await UrlService.createUrl(userId, originalUrl);

      return res.status(201).json({
        shortUrl: `${req.protocol}://${req.get("host")}/${url.short_code}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create short URL" });
    }
  }

  // Get analytics for user's URLs
  static async analytics(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = await UrlService.getAnalytics(userId);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Analytics error:", error);
      return res.status(500).json({ message: "Failed to fetch analytics" });
    }
  }

  // Redirect to original URL and record click
  static async redirect(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const url = await UrlService.getByShortCode(shortCode);

      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }

      await UrlService.recordClick(
        url.id,
        req.ip,
        req.headers["user-agent"] as string | undefined,
      );

      return res.redirect(url.original_url);
    } catch {
      return res.status(500).json({ message: "Redirect failed" });
    }
  }
}
