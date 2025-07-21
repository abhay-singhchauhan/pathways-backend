import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  sessionType: 'buddy' | 'mentor' | 'psychologist';
  reason: string;
  areasOfStruggle: string[];
  otherArea?: string;
  mentorType: 'male' | 'female' | 'doesn\'t matter';
  language: string;
  communicationMode: 'video' | 'audio' | 'phone call';
  date: Date;
  time: string;
  status: 'booked' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionType: {
      type: String,
      enum: ['buddy', 'mentor', 'psychologist'],
      required: true
    },
    reason: { type: String, required: true },
    areasOfStruggle: [{ type: String, required: true }],
    otherArea: { type: String },
    mentorType: {
      type: String,
      enum: ['male', 'female', "doesn't matter"],
      required: true
    },
    language: { type: String, required: true },
    communicationMode: {
      type: String,
      enum: ['google meet', 'phone call'],
      required: true
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed'],
      default: 'booked'
    }
  },
  { timestamps: true }
);

export default mongoose.model<ISession>('Session', sessionSchema); 