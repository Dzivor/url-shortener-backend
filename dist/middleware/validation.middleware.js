"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Middleware factory to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            // Format Zod errors into a structured response
            const errors = result.error.format();
            res.status(400).json({
                message: "Validation failed",
                errors: {
                    email: errors.email?._errors || [],
                    password: errors.password?._errors || [],
                    confirmPassword: errors.confirmPassword?._errors || [],
                    originalUrl: errors.originalUrl?._errors || [],
                    _form: errors._errors || [],
                },
            });
            return;
        }
        // Attach validated data to request body
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
