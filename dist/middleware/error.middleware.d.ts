import { Request, Response, NextFunction } from 'express';
export interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: any;
    errors?: any;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map