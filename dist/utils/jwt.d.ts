import { IUserDocument } from '../types/user.types';
export interface IJWTPayload {
    id: string;
    email: string;
    role: string;
}
export declare const generateToken: (user: IUserDocument | any) => string;
export declare const verifyToken: (token: string) => IJWTPayload;
export declare const decodeToken: (token: string) => IJWTPayload | null;
//# sourceMappingURL=jwt.d.ts.map