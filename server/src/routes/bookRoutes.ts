import express from 'express';
import { bookController } from '../controllers/bookController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', bookController.getBooks);
router.post('/', admin, bookController.addBook);
router.put('/:id', admin, bookController.updateBook);
router.delete('/:id', admin, bookController.deleteBook);

export default router;
