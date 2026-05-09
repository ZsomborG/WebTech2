import { motion } from 'framer-motion';
import { 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { APP_CONSTANTS } from '../constants/app.constants';
import { 
  Skeleton,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { BookOpen, Package, HandHelping, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { books, loading } = useBooks();
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


  const genreData = books.reduce((acc: any[], book) => {
    const existing = acc.find(item => item.name === book.genre);
    if (existing) {
      existing.value += book.quantity;
    } else {
      acc.push({ name: book.genre, value: book.quantity });
    }
    return acc;
  }, []);
  
  const stats = [
    { title: 'Total Copies', value: totalCopies, icon: Package, color: 'text-blue-500' },
    { title: 'Currently Borrowed', value: totalBorrowed, icon: HandHelping, color: 'text-orange-500' },
    { title: 'Your Borrows', value: myBorrowedCount, icon: BookOpen, color: 'text-green-500' },
    { title: 'Overdue Items', value: overdueCount, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Real-time overview of library activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {loading 
          ? Array.from({ length: 4 }).map((_, i) => (
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
          : stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
        }
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory by Genre</CardTitle>
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
            <CardTitle className="text-lg">Borrowing Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
                <HandHelping className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">{totalBorrowed} Books Out</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">
                {((totalBorrowed / totalCopies) * 100).toFixed(1)}% of the total inventory is currently in circulation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
