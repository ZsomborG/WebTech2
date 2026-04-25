import * as React from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Button,
} from '@/components/ui';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  Library 
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Books Inventory', path: '/books', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col border-r">
        <div className="p-4 flex items-center gap-2 border-b">
          <Library className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold">Library MS</span>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-bold leading-none truncate">{user?.username}</p>
              <p className="text-gray-500 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:bg-red-50 gap-2 h-8 text-xs"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
