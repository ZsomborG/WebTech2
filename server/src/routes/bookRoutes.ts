import express from 'express';
import { bookController } from '../controllers/bookController';
import { protect, admin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createBookSchema, updateBookSchema } from '../schemas/book.schema';

const router = express.Router();

router.use(protect);

router.get('/', bookController.getBooks);
router.post('/', admin, validate(createBookSchema), bookController.addBook);
router.put('/:id', admin, validate(updateBookSchema), bookController.updateBook);
router.delete('/:id', admin, bookController.deleteBook);

export default router;
