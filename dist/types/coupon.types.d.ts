export interface ICreateCouponInput {
    code: string;
    discountType: 'percentage' | 'amount';
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    isActive?: boolean;
}
export interface IUpdateCouponInput {
    discountType?: 'percentage' | 'amount';
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    isActive?: boolean;
}
export interface IValidateCouponRequest {
    code: string;
    orderAmount: number;
    userId?: string;
}
export interface IValidateCouponResponse {
    valid: boolean;
    reason?: string;
    code?: string;
    discountAmount?: number;
    finalAmount?: number;
}
//# sourceMappingURL=coupon.types.d.ts.map