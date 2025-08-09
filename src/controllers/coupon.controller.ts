import { Request, Response } from 'express';
import Coupon from '../models/coupon.model';
import { ICreateCouponInput, IUpdateCouponInput, IValidateCouponRequest } from '../types/coupon.types';

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: ICreateCouponInput = req.body;
    const coupon = await Coupon.create(payload);
    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ success: false, message: 'Coupon code already exists' });
      return;
    }
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllCoupons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCouponById = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    console.error('Get coupon by id error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const update: IUpdateCouponInput = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Coupon updated', data: coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderAmount, userId }: IValidateCouponRequest = req.body;

    if (!code || typeof orderAmount !== 'number') {
      res.status(400).json({ success: false, message: 'code and orderAmount are required' });
      return;
    }

    const now = new Date();
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid coupon code' });
      return;
    }

    if (coupon.startDate && now < coupon.startDate) {
      res.status(400).json({ success: false, message: 'Coupon not started yet' });
      return;
    }
    if (coupon.endDate && now > coupon.endDate) {
      res.status(400).json({ success: false, message: 'Coupon expired' });
      return;
    }
    if (typeof coupon.usageLimit === 'number' && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      return;
    }
    if (typeof coupon.minOrderAmount === 'number' && orderAmount < coupon.minOrderAmount) {
      res.status(400).json({ success: false, message: 'Order amount below minimum' });
      return;
    }

    // Optional per-user limit check: requires separate tracking by user usage history.
    // For now we only validate if perUserLimit is set and userId missing.
    if (coupon.perUserLimit && !userId) {
      res.status(400).json({ success: false, message: 'userId required to validate per-user limit' });
      return;
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (typeof coupon.maxDiscountAmount === 'number') {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }
    discountAmount = Math.max(0, Math.min(discountAmount, orderAmount));

    const finalAmount = Math.max(0, orderAmount - discountAmount);

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        code: coupon.code,
        discountAmount,
        finalAmount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


