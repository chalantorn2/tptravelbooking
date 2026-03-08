import React from 'react';
import Sidebar from './Sidebar';
import Notification from '../ui/Notification';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Layout;
