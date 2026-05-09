import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
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

interface YearChartProps {
  data: { year: string; count: number }[];
  loading: boolean;
}

export const YearChart: React.FC<YearChartProps> = ({ data, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inventory by Year</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <div className="flex flex-col gap-2 h-full justify-end">
            <div className="flex items-end gap-2 h-full">
              <Skeleton className="flex-1 h-[40%]" />
              <Skeleton className="flex-1 h-[70%]" />
              <Skeleton className="flex-1 h-[50%]" />
              <Skeleton className="flex-1 h-[90%]" />
              <Skeleton className="flex-1 h-[60%]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No yearly data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={APP_CONSTANTS.CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
