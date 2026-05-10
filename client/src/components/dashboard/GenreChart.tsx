import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
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
        <CardTitle className="text-lg font-semibold tracking-tight">Inventory by Genre</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
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
                labelLine={false}
                outerRadius={85}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={APP_CONSTANTS.CHART_COLORS[index % APP_CONSTANTS.CHART_COLORS.length]} 
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                    className="outline-none"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontWeight: '600', color: '#111827' }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                iconType="circle" 
                iconSize={8} 
                wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
