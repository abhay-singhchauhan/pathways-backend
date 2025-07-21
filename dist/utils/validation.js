"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(1).max(50).required().messages({
        'string.empty': 'First name is required',
        'string.max': 'First name cannot exceed 50 characters'
    }),
    lastName: joi_1.default.string().trim().min(1).max(50).required().messages({
        'string.empty': 'Last name is required',
        'string.max': 'Last name cannot exceed 50 characters'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required'
    }),
    dateOfBirth: joi_1.default.date().max('now').optional().messages({
        'date.max': 'Date of birth cannot be in the future'
    }),
    phoneNumber: joi_1.default.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional().messages({
        'string.pattern.base': 'Please provide a valid phone number'
    }),
    profileUrl: joi_1.default.string().optional(),
    role: joi_1.default.string().valid('user', 'admin', 'therapist').optional().default('user')
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(1).max(50).optional(),
    lastName: joi_1.default.string().trim().min(1).max(50).optional(),
    email: joi_1.default.string().email().optional(),
    dateOfBirth: joi_1.default.date().max('now').optional(),
    phone: joi_1.default.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional(),
    gender: joi_1.default.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
    isActive: joi_1.default.boolean().optional()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
    }),
    password: joi_1.default.string().required().messages({
        'string.empty': 'Password is required'
    })
});
exports.userIdSchema = joi_1.default.object({
    id: joi_1.default.string().hex().length(24).required().messages({
        'string.hex': 'Invalid user ID format',
        'string.length': 'Invalid user ID format'
    })
});
//# sourceMappingURL=validation.js.map