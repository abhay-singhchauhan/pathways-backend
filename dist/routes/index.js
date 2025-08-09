"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const service_routes_1 = __importDefault(require("./service.routes"));
const coupon_routes_1 = __importDefault(require("./coupon.routes"));
const session_routes_1 = __importDefault(require("./session.routes"));
const router = (0, express_1.Router)();
// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes
router.use('/users', user_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/services', service_routes_1.default);
router.use('/sessions', session_routes_1.default);
router.use('/coupons', coupon_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map