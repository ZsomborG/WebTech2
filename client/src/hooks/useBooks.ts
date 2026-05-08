import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBookDTO, UpdateBookDTO } from '../types/book';
import { bookService } from '../services/BookService';
import { toast } from 'sonner';

export const useBooks = () => {
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: loading } = useQuery({
    queryKey: ['books'],
    queryFn: () => bookService.getBooks(),
  });

  const addBookMutation = useMutation({
    mutationFn: (bookData: CreateBookDTO) => bookService.addBook(bookData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add book');
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookDTO }) => 
      bookService.updateBook(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update book');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete book');
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
    await deleteBookMutation.mutateAsync(id);
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    // Keep these for compatibility or remove if safe
    fetchBooks: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
    initialized: true, 
  };
};
