"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlController = void 0;
const url_service_1 = require("../services/url.service");
// Controller for handling URL shortening, analytics, and redirects
class UrlController {
    // Create a new shortened URL for authenticated user
    static async create(req, res) {
        try {
            const { originalUrl } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const url = await url_service_1.UrlService.createUrl(userId, originalUrl);
            return res.status(201).json({
                shortUrl: `${req.protocol}://${req.get("host")}/${url.short_code}`,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create short URL" });
        }
    }
    // Get analytics for user's URLs
    static async analytics(req, res) {
        try {
            const userId = req.user.userId;
            const data = await url_service_1.UrlService.getAnalytics(userId);
            return res.status(200).json(data);
        }
        catch (error) {
            console.error("Analytics error:", error);
            return res.status(500).json({ message: "Failed to fetch analytics" });
        }
    }
    // Redirect to original URL and record click
    static async redirect(req, res) {
        try {
            const { shortCode } = req.params;
            const url = await url_service_1.UrlService.getByShortCode(shortCode);
            if (!url) {
                return res.status(404).json({ message: "URL not found" });
            }
            await url_service_1.UrlService.recordClick(url.id, req.ip, req.headers["user-agent"]);
            return res.redirect(url.original_url);
        }
        catch {
            return res.status(500).json({ message: "Redirect failed" });
        }
    }
}
exports.UrlController = UrlController;
