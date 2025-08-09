import { Document } from 'mongoose';
export interface IService {
    name: string;
    description: string;
    details?: string;
    greatFor?: string;
    duration: number;
    price: number;
    mode: 'google meet' | 'phone call';
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IServiceDocument extends IService, Document {
}
export interface ICreateServiceInput {
    name: string;
    description: string;
    details?: string;
    greatFor?: string;
    duration: number;
    price: number;
    mode: 'google meet' | 'phone call';
    tags?: string[];
}
export interface IUpdateServiceInput {
    name?: string;
    description?: string;
    details?: string;
    greatFor?: string;
    duration?: number;
    price?: number;
    mode?: 'google meet' | 'phone call';
    tags?: string[];
}
//# sourceMappingURL=service.types.d.ts.map