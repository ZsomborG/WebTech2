import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBookDTO, UpdateBookDTO } from '../types/book';
import { bookService } from '../services/BookService';
import { type BookQueryFilters } from '../types/api';
import { borrowService } from '../services/BorrowService';
import { queryKeys } from '../lib/queryKeys';
import { toast } from 'sonner';

export const useBooks = (filters: BookQueryFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKeys.books.list(filters),
    queryFn: () => bookService.getBooks(filters),
  });

  const books = data?.data || [];
  const pagination = data?.pagination;

  const addBookMutation = useMutation({
    mutationFn: (bookData: CreateBookDTO) => bookService.addBook(bookData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add book');
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookDTO }) => 
      bookService.updateBook(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update book');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete book');
    },
  });

  const borrowBookMutation = useMutation({
    mutationFn: (bookId: string) => borrowService.borrowBook(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to borrow book');
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: (bookId: string) => borrowService.returnBook(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to return book');
    },
  });

  const addBook = async (bookData: CreateBookDTO) => {
    try {
      await addBookMutation.mutateAsync(bookData);
      return true;
    } catch {
      return false;
    }
  };

  const updateBook = async (id: string, data: UpdateBookDTO) => {
    try {
      await updateBookMutation.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  };

  const deleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBookMutation.mutateAsync(id);
    } catch {
    }
  };

  const borrowBook = async (id: string) => {
    try {
      await borrowBookMutation.mutateAsync(id);
    } catch {
    }
  };

  const returnBook = async (id: string) => {
    try {
      await returnBookMutation.mutateAsync(id);
    } catch {
    }
  };

  return {
    books,
    pagination,
    loading,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
  };
};
