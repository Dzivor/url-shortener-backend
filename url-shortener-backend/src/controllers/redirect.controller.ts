// Import Express Request and Response types for handling HTTP requests/responses
import { Request, Response } from "express";
// Import the UrlService for database operations related to URLs
import { UrlService } from "../services/url.service";

// Controller class for handling URL redirect operations
export class RedirectController {
  // Redirect user to the original URL and record click analytics
  static async redirect(req: Request, res: Response) {
    // Extract the short code from the URL parameters
    const { code } = req.params;

    // Look up the URL record in the database by its short code
    const url = await UrlService.findByShortCode(code);

    // Return 404 (Not Found) if the short URL does not exist
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Record the click event with the user's IP address and browser user agent
    await UrlService.recordClick(url.id, req.ip, req.headers["user-agent"]);

    // Redirect the user to the original long URL
    return res.redirect(url.original_url);
  }
}
