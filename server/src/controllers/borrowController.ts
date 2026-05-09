import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { borrowService, BorrowService } from '../services/BorrowService';

export class BorrowController {
  constructor(private service: BorrowService) {}

  borrowBook = async (req: AuthRequest, res: Response) => {
    const borrow = await this.service.borrowBook(req.params.id as string, req.user._id);
    res.status(201).json(borrow);
  };

  returnBook = async (req: AuthRequest, res: Response) => {
    const borrow = await this.service.returnBook(
      req.params.id as string, 
      req.user._id, 
      req.user.role === 'admin'
    );
    res.json(borrow);
  };

  getMyBorrows = async (req: AuthRequest, res: Response) => {
    const borrows = await this.service.getMyBorrows(req.user._id);
    res.json(borrows);
  };

  getAllActiveBorrows = async (req: AuthRequest, res: Response) => {
    const borrows = await this.service.getAllActiveBorrows();
    res.json(borrows);
  };
}

export const borrowController = new BorrowController(borrowService);
