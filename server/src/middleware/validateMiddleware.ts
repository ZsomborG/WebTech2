import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: z.ZodTypeAny) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0]?.message || 'Validation failed';
        next(new AppError(firstError, 400));
      } else {
        next(error);
      }
    }
};
