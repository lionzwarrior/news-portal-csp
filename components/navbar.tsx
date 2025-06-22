'use client';

import { User } from '@/app/global';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../app/globals.css';

export default function Navbar({ id }: { id: string | null }) {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await axios.post('/api/logout');
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(`http://localhost:5000/user/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">NewsPortal</div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300 transition">Home</Link>
          {!id && (
            <>
              <Link href="/login" className="hover:text-gray-300 transition">Log In</Link>
              <Link href="/register" className="hover:text-gray-300 transition">Register</Link>
            </>
          )}
          {user?.userType === 'admin' && (
            <>
              <Link href="/admin" className="hover:text-gray-300 transition">Admin</Link>
              <Link href="/users" className="hover:text-gray-300 transition">Users</Link>
            </>
          )}
          {user && (
            <>
              <Link href="/bookmarks" className="hover:text-gray-300 transition">Bookmark</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition px-3 py-1 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
