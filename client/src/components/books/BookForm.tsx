import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookFormSchema, type BookFormValues } from '../../schemas/book.schema';
import {
  Button,
  Input,
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
} from '@/components/ui';
import { Plus } from 'lucide-react';

interface BookFormProps {
  onSubmit: SubmitHandler<BookFormValues>;
  editingBook?: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ 
  onSubmit, 
  editingBook, 
  isOpen, 
  onOpenChange,
  onClose
}) => {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    values: editingBook ? {
      title: editingBook.title,
      author: editingBook.author,
      isbn: editingBook.isbn,
      publishedYear: editingBook.publishedYear,
      genre: editingBook.genre,
      quantity: editingBook.quantity,
    } : {
      title: '',
      author: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      genre: '',
      quantity: 1,
    },
  });

  const handleFormSubmit: SubmitHandler<BookFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) onClose();
    }}>
      <DialogTrigger render={<Button className="gap-2 w-full sm:w-auto" />}>
        <Plus className="w-4 h-4" /> Add New Book
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {editingBook ? 'Update the details of the selected book.' : 'Enter the details of the new book to add it to the collection.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(handleFormSubmit)(e)} className="space-y-4">
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
              {editingBook ? 'Update Book' : 'Save Book'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
