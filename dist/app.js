"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const redirect_routes_1 = __importDefault(require("./routes/redirect.routes"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        "http://url-shortener-frontend-dzv-123456.s3-website-us-east-1.amazonaws.com",
        "http://localhost:5173",
        "http://44.223.27.214:3000",
    ],
    credentials: true,
}));
// Security headers with Helmet
app.use((0, helmet_1.default)());
// Global middleware
app.use(express_1.default.json());
// JSON parsing error handler
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON" });
    }
    next(err);
});
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK" });
});
// Mount auth routes
app.use("/api/auth", auth_routes_1.default);
const url_routes_1 = __importDefault(require("./routes/url.routes"));
app.use("/api", url_routes_1.default);
app.use("/", redirect_routes_1.default);
exports.default = app;
