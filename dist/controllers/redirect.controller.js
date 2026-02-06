"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectController = void 0;
// Import the UrlService for database operations related to URLs
const url_service_1 = require("../services/url.service");
// Controller class for handling URL redirect operations
class RedirectController {
    static async redirect(req, res) {
        const { code } = req.params;
        const url = await url_service_1.UrlService.findByShortCode(code);
        if (!url) {
            return res.status(404).json({ message: "Short URL not found" });
        }
        await url_service_1.UrlService.recordClick(url.id, req.ip, req.headers["user-agent"]);
        return res.redirect(url.original_url);
    }
}
exports.RedirectController = RedirectController;
