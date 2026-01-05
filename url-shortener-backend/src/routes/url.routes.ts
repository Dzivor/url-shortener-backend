import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { UrlController } from "../controllers/url.controller";
import { RedirectController } from "../controllers/redirect.controller";

const router = Router();
const publicRedirectRouter = Router();

// Protected API routes
router.post("/shorten", authenticate, UrlController.create);
router.get("/analytics", authenticate, UrlController.analytics);
router.get("/urls/analytics", authenticate, UrlController.analytics);

// Public redirect route (mount this at "/")
router.get("/:code", UrlController.redirect);

export { publicRedirectRouter };
export default router;
