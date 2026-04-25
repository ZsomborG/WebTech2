import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Library System, {user?.username}!</h1>
      <p className="mb-4">Role: {user?.role}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Home;
