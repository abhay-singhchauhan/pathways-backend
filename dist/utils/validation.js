"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.loginSchema = exports.updateUserSchema = exports.createSessionSchema = exports.createUserSchema = void 0;
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
exports.createSessionSchema = joi_1.default.object({
    userId: joi_1.default.string().hex().length(24).required().messages({
        'string.hex': 'Invalid user ID format',
        'string.length': 'Invalid user ID format'
    }),
    serviceId: joi_1.default.string().hex().length(24).required().messages({
        'string.hex': 'Invalid service ID format',
        'string.length': 'Invalid service ID format'
    }),
    motivation: joi_1.default.string().required().messages({
        'string.empty': 'Motivation is required'
    }),
    strugglingAreas: joi_1.default.array().items(joi_1.default.string()).required().messages({
        'array.base': 'Struggling areas must be an array',
        'array.empty': 'Struggling areas are required'
    }),
    otherArea: joi_1.default.string().optional().allow(''),
    preferredMentorType: joi_1.default.string().valid('male', 'female', "no-preference").required().messages({
        'string.empty': 'Preferred mentor type is required'
    }),
    preferredLanguage: joi_1.default.string().required().messages({
        'string.empty': 'Preferred language is required'
    }),
    communicationMode: joi_1.default.string().valid('phone-call', 'google-meet').required().messages({
        'string.empty': 'Communication mode is required'
    }),
    // amount: Joi.number().required().messages({
    //   'number.base': 'Amount is required'
    // }),
    couponCode: joi_1.default.string().optional(),
    date: joi_1.default.date().required().messages({
        'date.base': 'Date is required'
    }),
    time: joi_1.default.string().required().messages({
        'string.empty': 'Time is required'
    })
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