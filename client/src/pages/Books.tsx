import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { bookFormSchema, type BookFormValues } from '../schemas/book.schema';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Badge,
  Skeleton,
} from '@/components/ui';
import { Plus, Search, Trash2, Edit2, Book as BookIcon, PackageOpen } from 'lucide-react';

const Books = () => {
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      genre: '',
      quantity: 1,
    },
  });

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    let success = false;
    if (editingBookId) {
      success = await updateBook(editingBookId, data);
    } else {
      success = await addBook(data);
    }

    if (success) {
      setIsDialogOpen(false);
      handleCloseDialog();
    }
  };

  const handleEdit = (book: any) => {
    setEditingBookId(book._id);
    form.reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      genre: book.genre,
      quantity: book.quantity,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingBookId(null);
    form.reset({
      title: '',
      author: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      genre: '',
      quantity: 1,
    });
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Books Inventory</h1>
          <p className="text-gray-500">
            {isAdmin ? 'Manage and track your library collection.' : 'View and search the library collection.'}
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) handleCloseDialog();
          }}>
            <DialogTrigger render={<Button className="gap-2" />}>
              <Plus className="w-4 h-4" /> Add New Book
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBookId ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogDescription>
                  {editingBookId ? 'Update the details of the selected book.' : 'Enter the details of the new book to add it to the collection.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="The Great Gatsby" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="F. Scott Fitzgerald" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <Input placeholder="Classic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder="978-0743273565" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="publishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Published Year</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingBookId ? 'Update Book' : 'Save Book'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[300px]">Book Details</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Qty</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  {isAdmin && <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>}
                </TableRow>
              ))
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="h-64 text-center">
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
                        onClick={() => setIsDialogOpen(true)}
                        className="mt-2"
                      >
                        Add Your First Book
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        <BookIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium leading-none">{book.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {book.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{book.isbn}</TableCell>
                  <TableCell>{book.publishedYear}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${book.quantity < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                      {book.quantity}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-blue-500"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => void deleteBook(book._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Books;
