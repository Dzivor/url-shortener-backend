"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRedirectRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const url_controller_1 = require("../controllers/url.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const schemas_1 = require("../schemas");
const router = (0, express_1.Router)();
const publicRedirectRouter = (0, express_1.Router)();
exports.publicRedirectRouter = publicRedirectRouter;
// Protected API routes with validation
router.post("/shorten", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(schemas_1.createUrlSchema), url_controller_1.UrlController.create);
router.get("/analytics", auth_middleware_1.authenticate, url_controller_1.UrlController.analytics);
router.get("/urls/analytics", auth_middleware_1.authenticate, url_controller_1.UrlController.analytics);
// Public redirect route (mount this at "/")
router.get("/:code", url_controller_1.UrlController.redirect);
exports.default = router;
