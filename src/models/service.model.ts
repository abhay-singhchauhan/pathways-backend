import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  details: string;
  greatFor: string;
  duration: number; // in minutes
  price: number;
  mode: 'google meet' | 'phone call';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String },
    greatFor: { type: String },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: {
      type: String,
      enum: ['google meet', 'phone call'],
      required: true
    },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', serviceSchema); 