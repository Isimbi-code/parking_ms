import React from 'react';
import { getUserFromToken, removeToken } from '../utils/auth';

const Header = () => {
  const user = getUserFromToken();

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
