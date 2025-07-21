import { Request, Response, NextFunction } from 'express';
import { IJWTPayload } from '../utils/jwt';
declare global {
    namespace Express {
        interface Request {
            user?: IJWTPayload;
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map