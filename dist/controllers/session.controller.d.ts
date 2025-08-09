import { Request, Response } from 'express';
export declare const createSession: (req: Request, res: Response) => Promise<void>;
export declare const validatePayment: (req: Request, res: Response) => Promise<void>;
export declare const getAllSessions: (req: Request, res: Response) => Promise<void>;
export declare const getSessionById: (req: Request, res: Response) => Promise<void>;
export declare const updateSession: (req: Request, res: Response) => Promise<void>;
export declare const deleteSession: (req: Request, res: Response) => Promise<void>;
export declare const assignTherapist: (req: Request, res: Response) => Promise<void>;
export declare const updateStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=session.controller.d.ts.map