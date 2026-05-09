import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Skeleton
} from '@/components/ui';
import { APP_CONSTANTS } from '../../constants/app.constants';

interface GenreChartProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

export const GenreChart: React.FC<GenreChartProps> = ({ data, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inventory by Genre</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No genre data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={APP_CONSTANTS.CHART_COLORS[index % APP_CONSTANTS.CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
