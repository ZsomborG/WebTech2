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

  register = async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      throw new AppError(firstError, 400);
    }

    const user = await this.service.register(validation.data);
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError('Invalid input', 400);
    }

    const user = await this.service.login(validation.data);
    res.json(user);
  };
}

export const authController = new AuthController(authService);
