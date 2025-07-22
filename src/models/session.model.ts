import mongoose, { Schema, Document } from 'mongoose';

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

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    therapistId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    motivation: { type: String, required: true },
    strugglingAreas: [{ type: String, required: true }],
    otherArea: { type: String },
    preferredMentorType: {
      type: String,
      enum: ['male', 'female', "no-preference"],
      required: true
    },
    preferredLanguage: { type: String, required: true },
    communicationMode: {
      type: String,
      enum: ['google-meet', 'phone-call'],
      required: true
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentId: { type: String },
    orderId: { type: String },
    couponCode: { type: String },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model<ISession>('Session', sessionSchema); 