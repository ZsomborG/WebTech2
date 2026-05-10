import { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { BookForm } from '../components/books/BookForm';
import { BookFilters } from '../components/books/BookFilters';
import { BookTable } from '../components/books/BookTable';
import { Pagination } from '../components/books/Pagination';
import { type Book } from '../types/book';

const Books = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filters State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    genre: 'All',
    sortBy: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
  });

  const { books, pagination, loading, addBook, updateBook, deleteBook, borrowBook, returnBook } = useBooks(filters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleBookSubmit = async (data: any) => {
    let success = false;
    if (editingBook) {
      success = await updateBook(editingBook._id, data);
    } else {
      success = await addBook(data);
    }

    if (success) {
      setIsDialogOpen(false);
      setEditingBook(null);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingBook(null);
    setIsDialogOpen(false);
  };

  const handleSortChange = (newSortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: newSortBy,
      order: prev.sortBy === newSortBy ? (prev.order === 'asc' ? 'desc' : 'asc') : 'desc',
      page: 1
    }));
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Books Inventory</h1>
          <p className="text-sm text-gray-500">
            {isAdmin ? 'Manage and track your library collection.' : 'View and search the library collection.'}
          </p>
        </div>
        
        {isAdmin && (
          <BookForm
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleBookSubmit}
            editingBook={editingBook}
            onClose={handleCloseDialog}
          />
        )}
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-zinc-100/95 backdrop-blur-md border-b border-zinc-200/80 -mx-6 px-6 py-4 mb-4 shadow-sm">
        <BookFilters
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          genre={filters.genre}
          onGenreChange={(val) => setFilters(prev => ({ ...prev, genre: val, page: 1 }))}
          sortBy={filters.sortBy}
          order={filters.order}
          onSortChange={handleSortChange}
          onOrderToggle={() => setFilters(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
        />
      </div>

      {/* Table Section */}
      <BookTable
        books={books}
        loading={loading}
        isAdmin={isAdmin}
        currentUserId={user?._id}
        onEdit={handleEdit}
        onDelete={deleteBook}
        onBorrow={borrowBook}
        onReturn={returnBook}
        searchTerm={filters.search}
        onAddFirst={() => setIsDialogOpen(true)}
      />

      {/* Pagination Section */}
      {pagination && (
        <Pagination
          currentPage={filters.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          limit={filters.limit}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default Books;
