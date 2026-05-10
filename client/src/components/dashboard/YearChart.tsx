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
        <CardTitle className="text-lg font-semibold tracking-tight">Inventory Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
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
            No acquisition data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontWeight: '600', color: '#3b82f6' }}
              />
              <Bar 
                dataKey="count" 
                fill={APP_CONSTANTS.CHART_COLORS[0]} 
                radius={[4, 4, 0, 0]} 
                barSize={32}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
