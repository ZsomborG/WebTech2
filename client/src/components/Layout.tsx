import * as React from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui';
import { LayoutDashboard, BookOpen, LogOut, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems =[
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Books Inventory', path: '/books', icon: BookOpen, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="flex h-screen bg-zinc-100 font-sans">
      {/* PREMIUM DARK SIDEBAR */}
      <aside className="w-64 bg-zinc-950 flex flex-col shadow-2xl z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-900">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Library className="w-5 h-5 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Library MS</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Menu</p>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-200" : "text-zinc-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ring-zinc-800">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-100 truncate">{user?.username}</p>
              <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs text-zinc-300 border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-white h-8"
              onClick={() => switchRole()}
            >
              Demo: Switch to {user?.role === 'admin' ? 'User' : 'Admin'}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 gap-2 h-8 text-xs transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto relative">
        {/* Subtle decorative color wash at the top of the page */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
