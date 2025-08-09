import mongoose, { Document } from 'mongoose';
export interface IService extends Document {
    name: string;
    description: string;
    details: string;
    greatFor: string;
    duration: number;
    price: number;
    mode: 'google meet' | 'phone call';
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}> & IService & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=service.model.d.ts.map