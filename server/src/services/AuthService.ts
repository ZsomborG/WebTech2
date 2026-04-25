import jwt from 'jsonwebtoken';
import { userRepository, UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  private generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });
  }

  async register(userData: any) {
    const userExists = await this.userRepo.findByUsername(userData.username);
    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const user = await this.userRepo.create(userData);
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: this.generateToken(user._id.toString()),
    };
  }

  async login(credentials: any) {
    const user: any = await this.userRepo.findByUsername(credentials.username);
    if (user && (await user.comparePassword(credentials.password))) {
      return {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: this.generateToken(user._id.toString()),
      };
    }
    throw new AppError('Invalid username or password', 401);
  }
}

export const authService = new AuthService(userRepository);
