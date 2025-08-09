"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public validation endpoint
router.post('/validate', coupon_controller_1.validateCoupon);
// Admin protected CRUD
router.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('admin'));
router.post('/', coupon_controller_1.createCoupon);
router.get('/', coupon_controller_1.getAllCoupons);
router.get('/:id', coupon_controller_1.getCouponById);
router.put('/:id', coupon_controller_1.updateCoupon);
router.delete('/:id', coupon_controller_1.deleteCoupon);
exports.default = router;
//# sourceMappingURL=coupon.routes.js.map