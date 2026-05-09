import Book from '../models/Book';

export interface BookQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
}

export class BookRepository {
  async findAll(options: BookQueryOptions = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      order = 'desc',
      search,
      genre
    } = options;

    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre && genre !== 'All') {
      filter.genre = genre;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter)
    ]);

    return { books, total };
  }

  async findByIsbn(isbn: string) {
    return await Book.findOne({ isbn });
  }

  async findById(id: string) {
    return await Book.findById(id);
  }

  async create(bookData: any) {
    return await Book.create(bookData);
  }

  async update(id: string, bookData: any) {
    return await Book.findByIdAndUpdate(id, bookData, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return await Book.findByIdAndDelete(id);
  }
}

export const bookRepository = new BookRepository();
