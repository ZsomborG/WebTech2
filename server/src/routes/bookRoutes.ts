import express from 'express';
import { bookController } from '../controllers/bookController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', bookController.getBooks);
router.post('/', bookController.addBook);
router.delete('/:id', bookController.deleteBook);

export default router;
