import { Document } from 'mongoose';

export interface ISession {
  user: string; // User ID
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

export interface ISessionDocument extends ISession, Document {}

export interface ICreateSessionInput {
  user: string;
  sessionType: 'buddy' | 'mentor' | 'psychologist';
  reason: string;
  areasOfStruggle: string[];
  otherArea?: string;
  mentorType: 'male' | 'female' | "doesn't matter";
  language: string;
  communicationMode: 'google meet' | 'phone call';
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