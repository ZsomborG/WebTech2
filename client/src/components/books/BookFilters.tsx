import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown 
} from 'lucide-react';
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { APP_CONSTANTS } from '../../constants/app.constants';

interface BookFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (sortBy: string) => void;
  onOrderToggle: () => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  searchInput,
  onSearchChange,
  genre,
  onGenreChange,
  sortBy,
  order,
  onSortChange,
  onOrderToggle,
}) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by title, author, or ISBN..."
          className="pl-10"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select 
            value={genre} 
            onValueChange={(val) => onGenreChange(val || 'All')}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Genres</SelectItem>
              {APP_CONSTANTS.DEFAULT_BOOK_GENRES.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select 
          value={sortBy} 
          onValueChange={(val) => onSortChange(val || 'createdAt')}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="publishedYear">Year</SelectItem>
            <SelectItem value="quantity">Quantity</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={onOrderToggle}
        >
          <ArrowUpDown className={`w-4 h-4 transition-transform ${order === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
