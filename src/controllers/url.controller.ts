// Import Express Request and Response types for request/response handling
import { Request, Response } from "express";
// Import the UrlService for database operations
import { UrlService } from "../services/url.service";
// Import custom authenticated request type that includes user data
import { AuthenticatedRequest } from "../middleware/auth.middleware";
// Import the URL creation schema type
import { CreateUrlSchema } from "../schemas";

// Controller class for handling URL-related HTTP requests
export class UrlController {
  // Create a new shortened URL for an authenticated user
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Data is already validated by Zod middleware
      const { originalUrl }: CreateUrlSchema = req.body;

      // Get the authenticated user's ID
      const userId = req.user.userId;

      // Create the shortened URL using the service
      const url = await UrlService.createUrl(userId, originalUrl);

      // Return the generated short URL with 201 (Created) status
      return res.status(201).json({
        shortUrl: `${req.protocol}://${req.get("host")}/${url.short_code}`,
      });
    } catch (error) {
      // Log error and return 500 (Internal Server Error) status
      console.error(error);
      return res.status(500).json({ message: "Failed to create short URL" });
    }
  }

  // Retrieve analytics data for all URLs owned by the authenticated user
  static async analytics(req: AuthenticatedRequest, res: Response) {
    try {
      // Get the authenticated user's ID
      const userId = req.user!.userId;
      // Fetch analytics data (short code, original URL, and click counts)
      const data = await UrlService.getAnalytics(userId);
      // Return analytics data with 200 (OK) status
      return res.status(200).json(data);
    } catch (error) {
      // Log error details
      console.error("Analytics error:", error);
      // Return error response if analytics retrieval fails
      return res.status(500).json({ message: "Failed to fetch analytics" });
    }
  }

  // Redirect to the original URL and record the click
  static async redirect(req: Request, res: Response) {
    try {
      // Extract the short code from the URL parameters
      const { shortCode } = req.params;

      // Look up the URL by its short code
      const url = await UrlService.getByShortCode(shortCode);

      // Return 404 (Not Found) if the short URL does not exist
      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }

      // Record the click in the clicks table with IP and user agent
      await UrlService.recordClick(
        url.id,
        req.ip,
        req.headers["user-agent"] as string | undefined
      );

      // Redirect the user to the original URL
      return res.redirect(url.original_url);
    } catch {
      // Return error response if redirect operation fails
      return res.status(500).json({ message: "Redirect failed" });
    }
  }
}

