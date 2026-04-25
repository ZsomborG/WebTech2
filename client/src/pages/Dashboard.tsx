import { useEffect, useState } from 'react';
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
import { bookService } from '../services/BookService';
import { APP_CONSTANTS } from '../constants/app.constants';
import type { Book } from '../types/book';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { BookOpen, Package, Hash } from 'lucide-react';

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchBooks();
  }, []);

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

  if (loading) return <div className="p-4 text-gray-500">Loading dashboard data...</div>;

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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Books by Genre</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Books by Year</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={APP_CONSTANTS.CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
