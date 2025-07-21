import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser, IUserDocument } from '../types/user.types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN || '3600');

export interface IJWTPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUserDocument | any): string => {
  const payload: IJWTPayload = {
    id: user._id?.toString() || user.id,
    email: user.email,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): IJWTPayload => {
  try {
    console.log(token, 'this is the token')
    return jwt.verify(token, JWT_SECRET) as IJWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token: string): IJWTPayload | null => {
  try {
    return jwt.decode(token) as IJWTPayload;
  } catch (error) {
    return null;
  }
}; 