import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book as BookIcon, 
  PackageOpen, 
  HandHelping, 
  RotateCcw,
  Edit2,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Skeleton,
  Button,
} from '@/components/ui';
import { type Book } from '../../types/book';

interface BookTableProps {
  books: Book[];
  loading: boolean;
  isAdmin: boolean;
  currentUserId?: string;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
  searchTerm: string;
  onAddFirst: () => void;
}

export const BookTable: React.FC<BookTableProps> = ({
  books,
  loading,
  isAdmin,
  currentUserId,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  searchTerm,
  onAddFirst,
}) => {
  return (
    <div className="rounded-xl bg-white overflow-hidden shadow-sm ring-1 ring-zinc-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-100">
            <TableHead className="w-[300px]">Book Details</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Status/Qty</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="w-[300px]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-28 font-mono" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    {isAdmin && <Skeleton className="h-8 w-8 rounded-md" />}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-80 text-center">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-5 ring-1 ring-blue-200/50 shadow-sm">
                    <PackageOpen className="h-10 w-10 text-blue-600/80" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                      {searchTerm ? 'No matches found' : 'No books yet'}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[280px] mx-auto text-balance leading-relaxed">
                      {searchTerm 
                        ? `We couldn't find anything matching "${searchTerm}". Try adjusting your filters.`
                        : isAdmin 
                          ? 'Start building your digital library by adding your first book to the collection.'
                          : 'The library is currently empty. Check back later for new arrivals.'
                      }
                    </p>
                  </div>
                  {isAdmin && !searchTerm && (
                    <Button 
                      onClick={onAddFirst}
                      className="mt-8 shadow-md hover:shadow-lg transition-all"
                    >
                      Add Your First Book
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {books.map((book, index) => {
                const isBorrowedByMe = book.activeBorrows?.some(b => 
                   (typeof b.user === 'string' ? b.user : (b.user as any)._id) === currentUserId
                );
                
                return (
                  <motion.tr
                    key={book._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b border-zinc-100 last:border-0 transition-colors even:bg-zinc-50/50 hover:bg-indigo-50/40 data-[state=selected]:bg-zinc-100"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <BookIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-none text-sm text-zinc-900">{book.title}</p>
                          <p className="text-xs text-zinc-500 mt-1">{book.author}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-[10px] bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                        {book.genre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            book.availableQuantity > 0 
                               ? 'bg-emerald-100 text-emerald-700' 
                               : 'bg-rose-100 text-rose-700'
                          }`}>
                            {book.availableQuantity > 0 ? 'Available' : 'Unavailable'}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium">
                            {book.availableQuantity} / {book.quantity}
                          </span>
                        </div>
                        {isBorrowedByMe && (
                          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                            In your possession
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-zinc-500">{book.isbn}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {isBorrowedByMe ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-none"
                            onClick={() => onReturn(book._id)}
                          >
                            <RotateCcw className="w-3 h-3" />
                            Return
                          </Button>
                        ) : book.availableQuantity > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 shadow-none"
                            onClick={() => onBorrow(book._id)}
                          >
                            <HandHelping className="w-3 h-3" />
                            Borrow
                          </Button>
                        ) : null}
                        
                        {isAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => onEdit(book)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => onDelete(book._id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
