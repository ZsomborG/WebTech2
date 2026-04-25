import { z } from 'zod';

export const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, 'Genre is required'),
  quantity: z.number().int().min(0),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
