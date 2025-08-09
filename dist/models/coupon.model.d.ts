import mongoose, { Document } from 'mongoose';
export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'amount';
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    usageLimit?: number;
    usedCount: number;
    perUserLimit?: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICoupon, {}, {}, {}, mongoose.Document<unknown, {}, ICoupon, {}> & ICoupon & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=coupon.model.d.ts.map