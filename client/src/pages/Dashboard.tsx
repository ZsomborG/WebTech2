import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useBooks } from '../hooks/useBooks';
import { APP_CONSTANTS } from '../constants/app.constants';
import { 
  Skeleton,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { BookOpen, Package, Hash } from 'lucide-react';

const Dashboard = () => {
  const { books, loading } = useBooks();

  const totalBooks = books.reduce((acc, book) => acc + book.quantity, 0);
  const uniqueTitles = books.length;
  
  const genreData = books.reduce((acc: any[], book) => {
    const existing = acc.find(item => item.name === book.genre);
    if (existing) {
      existing.value += book.quantity;
    } else {
      acc.push({ name: book.genre, value: book.quantity });
    }
    return acc;
  }, []);

  const yearData = books.reduce((acc: any[], book) => {
    const yearStr = book.publishedYear.toString();
    const existing = acc.find(item => item.year === yearStr);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ year: yearStr, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const stats = [
    { title: 'Total Copies', value: totalBooks, icon: Package, color: 'text-blue-500' },
    { title: 'Unique Titles', value: uniqueTitles, icon: BookOpen, color: 'text-green-500' },
    { title: 'Genres', value: genreData.length, icon: Hash, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Real-time overview of your library collection.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {loading 
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))
        }
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Books by Genre</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {genreData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={APP_CONSTANTS.CHART_COLORS[index % APP_CONSTANTS.CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Books by Year</CardTitle>
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
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData}>
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
      </div>
    </div>
  );
};

export default Dashboard;
