import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from '../services/AuthService';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
        return next(new AppError(firstError, 400));
      }

      const user = await this.service.register(validation.data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return next(new AppError('Invalid input', 400));
      }

      const user = await this.service.login(validation.data);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController(authService);
