import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Book, CreateBookDTO, UpdateBookDTO } from '../types/book';
import { bookService } from '../services/BookService';
import { toast } from 'sonner';

interface BookContextType {
  books: Book[];
  loading: boolean;
  fetchBooks: () => Promise<void>;
  addBook: (bookData: CreateBookDTO) => Promise<boolean>;
  updateBook: (id: string, bookData: UpdateBookDTO) => Promise<boolean>;
  deleteBook: (id: string) => Promise<void>;
  initialized: boolean;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
      setInitialized(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = async (bookData: CreateBookDTO) => {
    try {
      const newBook = await bookService.addBook(bookData);
      toast.success('Book added successfully');
      setBooks((prev) => [newBook, ...prev]);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book');
      return false;
    }
  };

  const updateBook = async (id: string, bookData: UpdateBookDTO) => {
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      toast.success('Book updated successfully');
      setBooks((prev) => prev.map((b) => (b._id === id ? updatedBook : b)));
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update book');
      return false;
    }
  };

  const deleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookService.deleteBook(id);
      toast.success('Book removed');
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book');
    }
  };

  return (
    <BookContext.Provider 
      value={{ 
        books, 
        loading, 
        fetchBooks, 
        addBook, 
        updateBook, 
        deleteBook,
        initialized 
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};
