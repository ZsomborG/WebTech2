export const queryKeys = {
  books: {
    all: ['books'] as const,
    lists: () => [...queryKeys.books.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.books.lists(), filters] as const,
    details: () => [...queryKeys.books.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.books.details(), id] as const,
  },
  borrows: {
    all: ['borrows'] as const,
    myBorrows: () => [...queryKeys.borrows.all, 'my'] as const,
    active: () => [...queryKeys.borrows.all, 'active'] as const,
  }
};
