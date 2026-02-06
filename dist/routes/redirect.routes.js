"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../controllers/url.controller");
const router = (0, express_1.Router)();
// ❗ PUBLIC route — NO auth middleware
router.get("/:shortCode", url_controller_1.UrlController.redirect);
exports.default = router;
