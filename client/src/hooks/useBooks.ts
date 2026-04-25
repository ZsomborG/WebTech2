import { useState, useCallback } from 'react';
import { type Book } from '../types/book';
import { bookService } from '../services/BookService';
import { toast } from 'sonner';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = async (bookData: any) => {
    try {
      const newBook = await bookService.addBook(bookData);
      toast.success('Book added successfully');
      setBooks((prev) => [newBook, ...prev]);
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const deleteBook = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await bookService.deleteBook(id);
      toast.success('Book removed');
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    books,
    loading,
    fetchBooks,
    addBook,
    deleteBook,
  };
};
