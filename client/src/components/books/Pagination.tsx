import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
        <span className="font-medium">
          {Math.min(currentPage * limit, totalItems)}
        </span> of{' '}
        <span className="font-medium">{totalItems}</span> books
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(i + 1)}
            className="h-8 w-8 p-0 text-xs"
          >
            {i + 1}
          </Button>
        )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
