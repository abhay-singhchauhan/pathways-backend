"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
// @desc    Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        try {
            // Verify token
            const decoded = (0, jwt_1.verifyToken)(token);
            // Check if user still exists and is active
            const user = await user_model_1.default.findById(decoded.id);
            if (!user || !user.isActive) {
                res.status(401).json({
                    success: false,
                    message: 'User no longer exists or is inactive'
                });
                return;
            }
            // Add user to request object
            req.user = decoded;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.protect = protect;
// @desc    Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Not authenticated.'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
// @desc    Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            try {
                const decoded = (0, jwt_1.verifyToken)(token);
                const user = await user_model_1.default.findById(decoded.id);
                if (user && user.isActive) {
                    req.user = decoded;
                }
            }
            catch (error) {
                // Ignore token errors for optional auth
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map