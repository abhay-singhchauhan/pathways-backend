import mongoose, { Document } from 'mongoose';
export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    therapistId?: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    motivation: string;
    strugglingAreas: string[];
    otherArea?: string;
    preferredMentorType: 'male' | 'female' | "no-preference";
    preferredLanguage: string;
    communicationMode: 'video' | 'audio' | 'phone call';
    amount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string;
    orderId?: string;
    couponCode?: string;
    date: Date;
    time: string;
    status: 'pending' | 'assigned' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}> & ISession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=session.model.d.ts.map