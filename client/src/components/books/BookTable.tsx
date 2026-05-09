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
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
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
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24 font-mono" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <PackageOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {searchTerm ? 'No matches found' : 'No books in collection'}
                    </p>
                    <p className="text-sm text-gray-500 max-w-[200px] mx-auto text-balance">
                      {searchTerm 
                        ? `We couldn't find anything matching "${searchTerm}"`
                        : isAdmin 
                          ? 'Start building your library by adding your first book.'
                          : 'Check back later for new arrivals.'
                      }
                    </p>
                  </div>
                  {isAdmin && !searchTerm && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onAddFirst}
                      className="mt-2"
                    >
                      Add Your First Book
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence mode="popLayout">
              {books.map((book, index) => {
                const isBorrowedByMe = book.activeBorrows?.some(b => 
                  (typeof b.user === 'string' ? b.user : (b.user as any)._id) === currentUserId
                );
                
                return (
                  <motion.tr
                    key={book._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b last:border-0 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                          <BookIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-none text-sm">{book.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-[10px]">
                        {book.genre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            book.availableQuantity > 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {book.availableQuantity > 0 ? 'Available' : 'Unavailable'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {book.availableQuantity} / {book.quantity}
                          </span>
                        </div>
                        {isBorrowedByMe && (
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                            In your possession
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-gray-500">{book.isbn}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {isBorrowedByMe ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => onReturn(book._id)}
                          >
                            <RotateCcw className="w-3 h-3" />
                            Return
                          </Button>
                        ) : book.availableQuantity > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1.5 text-green-600 border-green-200 hover:bg-green-50"
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
                              className="h-8 w-8 text-gray-400 hover:text-blue-500"
                              onClick={() => onEdit(book)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-500"
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
