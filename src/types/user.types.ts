import { Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Made optional for response objects
  dateOfBirth?: Date;
  phone?: string;
  role: 'user' | 'admin' | 'therapist';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileUrl?: string;
  gender?: string;
  }

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password: string; // Required in document
  comparePassword(candidatePassword: string): Promise<boolean>;
  getFullName(): string;
}

export interface ICreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  role?: 'user' | 'admin' | 'therapist';
}

export interface IUpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  role?: 'user' | 'admin' | 'therapist';
  isActive?: boolean;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
} 