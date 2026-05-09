import Borrow from '../models/Borrow';

export class BorrowRepository {
  async create(borrowData: any) {
    return await Borrow.create(borrowData);
  }

  async findActiveByBookAndUser(bookId: string, userId: string) {
    return await Borrow.findOne({ book: bookId, user: userId, status: 'active' });
  }

  async findActiveByBook(bookId: string) {
    return await Borrow.find({ book: bookId, status: 'active' }).populate('user', 'username');
  }

  async findById(id: string) {
    return await Borrow.findById(id);
  }

  async update(id: string, updateData: any) {
    return await Borrow.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findAllActive() {
    return await Borrow.find({ status: 'active' })
      .populate('book', 'title author isbn')
      .populate('user', 'username')
      .sort({ dueDate: 1 });
  }

  async findByUser(userId: string) {
    return await Borrow.find({ user: userId })
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });
  }
}

export const borrowRepository = new BorrowRepository();
