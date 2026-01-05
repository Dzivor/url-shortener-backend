import { Router } from "express";
import { UrlController } from "../controllers/url.controller";

const router = Router();

// ❗ PUBLIC route — NO auth middleware
router.get("/:shortCode", UrlController.redirect);

export default router;
