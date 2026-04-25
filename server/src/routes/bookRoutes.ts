import express from 'express';
import { getBooks, addBook, deleteBook } from '../controllers/bookController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All book routes require authentication

router.get('/', getBooks);
router.post('/', addBook);
router.delete('/:id', deleteBook);

export default router;
