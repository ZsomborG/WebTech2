import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { GenreChart } from '../components/dashboard/GenreChart';
import { YearChart } from '../components/dashboard/YearChart';
import { BookOpen, Package, HandHelping, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { books, loading } = useBooks({ all: true });
  const { user } = useAuth();

  const totalCopies = books.reduce((acc, book) => acc + book.quantity, 0);
  const totalBorrowed = books.reduce((acc, book) => acc + (book.activeBorrows?.length || 0), 0);
  const myBorrowedCount = books.reduce((acc, book) => {
    return acc + (book.activeBorrows?.filter(b => 
      (typeof b.user === 'string' ? b.user : (b.user as any)._id) === user?._id
    ).length || 0);
  }, 0);

  const overdueCount = books.reduce((acc, book) => {
    return acc + (book.activeBorrows?.filter(b => 
      new Date(b.dueDate) < new Date()
    ).length || 0);
  }, 0);

  const genreData = books.reduce((acc: { name: string; value: number }[], book) => {
    const existing = acc.find(item => item.name === book.genre);
    if (existing) {
      existing.value += book.quantity;
    } else {
      acc.push({ name: book.genre, value: book.quantity });
    }
    return acc;
  }, []);

  const yearData = books.reduce((acc: { year: string; count: number }[], book) => {
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
    { title: 'Total Copies', value: totalCopies, icon: Package, color: 'text-blue-500' },
    { title: 'Currently Borrowed', value: totalBorrowed, icon: HandHelping, color: 'text-orange-500' },
    { title: 'Your Borrows', value: myBorrowedCount, icon: BookOpen, color: 'text-green-500' },
    { title: 'Overdue Items', value: overdueCount, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Library Insights</h1>
        <p className="text-sm text-gray-500">A real-time overview of your library collection and activity.</p>
      </div>

      <StatsGrid stats={stats} loading={loading} />

      <div className="grid gap-6 md:grid-cols-2">
        <GenreChart data={genreData} loading={loading} />
        <YearChart data={yearData} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
