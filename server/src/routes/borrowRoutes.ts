import express from 'express';
import { borrowController } from '../controllers/borrowController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/:id/borrow', borrowController.borrowBook);
router.post('/:id/return', borrowController.returnBook);
router.get('/my', borrowController.getMyBorrows);
router.get('/active', admin, borrowController.getAllActiveBorrows);

export default router;
