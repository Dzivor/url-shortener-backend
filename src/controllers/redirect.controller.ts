import { Request, Response } from "express";
// Import the UrlService for database operations related to URLs
import { UrlService } from "../services/url.service";

// Controller class for handling URL redirect operations
export class RedirectController {
  static async redirect(req: Request, res: Response) {
    const { code } = req.params;

    const url = await UrlService.findByShortCode(code);

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    await UrlService.recordClick(url.id, req.ip, req.headers["user-agent"]);

    return res.redirect(url.original_url);
  }
}
