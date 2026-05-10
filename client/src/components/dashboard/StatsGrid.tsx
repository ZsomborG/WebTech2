import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
  loading: boolean;
}

// Updated to map to soft background colors for the icons
const colorMap: Record<string, string> = {
  'text-blue-500': 'bg-blue-100 text-blue-600',
  'text-orange-500': 'bg-orange-100 text-orange-600',
  'text-green-500': 'bg-green-100 text-green-600',
  'text-red-500': 'bg-rose-100 text-rose-600',
};

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-zinc-100" />
              <Skeleton className="w-10 h-10 rounded-lg bg-zinc-100" />
            </div>
            <Skeleton className="mt-4 h-9 w-16 bg-zinc-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200/80 hover:shadow-md hover:border-zinc-300 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">{stat.title}</p>
            <div className={cn("p-2.5 rounded-lg", colorMap[stat.color] || 'bg-zinc-100 text-zinc-600')}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-3xl font-semibold tracking-tight text-zinc-900">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
