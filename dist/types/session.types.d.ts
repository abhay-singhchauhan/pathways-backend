import { Document } from 'mongoose';
export interface ISession {
    user: string;
    sessionType: 'buddy' | 'mentor' | 'psychologist';
    reason: string;
    areasOfStruggle: string[];
    otherArea?: string;
    mentorType: 'male' | 'female' | "doesn't matter";
    language: string;
    communicationMode: 'video' | 'audio' | 'phone call';
    date: Date;
    time: string;
    status: 'booked' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
export interface ISessionDocument extends ISession, Document {
}
export interface ICreateSessionInput {
    userId: string;
    therapistId?: string;
    serviceId: string;
    motivation: string;
    strugglingAreas: string[];
    otherArea?: string;
    preferredMentorType: 'male' | 'female' | "doesn't matter";
    preferredLanguage: string;
    communicationMode: 'video' | 'audio' | 'phone call';
    amount: number;
    orderId?: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    couponCode?: string;
    date: Date;
    time: string;
}
export interface IUpdateSessionInput {
    sessionType?: 'buddy' | 'mentor' | 'psychologist';
    reason?: string;
    areasOfStruggle?: string[];
    otherArea?: string;
    mentorType?: 'male' | 'female' | "doesn't matter";
    language?: string;
    communicationMode?: 'video' | 'audio' | 'phone call';
    date?: Date;
    time?: string;
    status?: 'booked' | 'cancelled' | 'completed';
}
//# sourceMappingURL=session.types.d.ts.map