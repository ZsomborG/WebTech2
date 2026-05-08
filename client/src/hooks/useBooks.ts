import { useBookContext } from '../context/BookContext';

export const useBooks = () => {
  return useBookContext();
};
