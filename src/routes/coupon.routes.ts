import { Router } from 'express';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon, validateCoupon } from '../controllers/coupon.controller';
import { authorize, protect } from '../middleware/auth.middleware';

const router = Router();

// Public validation endpoint
router.post('/validate', validateCoupon);

// Admin protected CRUD
router.use(protect, authorize('admin'));
router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;


