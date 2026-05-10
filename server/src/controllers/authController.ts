import { Request, Response } from 'express';
import { authService, AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    // Controller assumes req.body is already validated by middleware
    const user = await this.service.register(req.body);
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response) => {
    // Controller assumes req.body is already validated by middleware
    const user = await this.service.login(req.body);
    res.json(user);
  };
}

export const authController = new AuthController(authService);
