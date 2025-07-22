import mongoose from 'mongoose';
import { IUserDocument } from '../types/user.types';
declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=user.model.d.ts.map