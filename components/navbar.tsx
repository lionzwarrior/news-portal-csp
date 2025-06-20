'use client';

import { User } from '@/app/global';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar({ id }: { id: string | null }) {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await axios.post('/api/logout');
    window.location.href = "/"
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
    <nav style={{ padding: '1rem', backgroundColor: '#282c34', color: 'white' }}>
      <h1 style={{ display: 'inline-block', marginRight: '2rem' }}>NewsPortal</h1>
      <Link href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      {!id ?
        <>
          <Link href="/login" style={{ color: 'white', marginRight: '1rem' }}>Log In</Link>
          <Link href="/register" style={{ color: 'white', marginRight: '1rem' }}>Register</Link>
        </> : ""}
      {user?.userType === 'admin' && (
        <>
          <Link href="/admin" style={{ color: 'white', marginRight: '1rem' }}>Admin</Link>
          <Link href="/users" style={{ color: 'white', marginRight: '1rem' }}>Users</Link>
        </>
      )}
      {user && (
        <>
          <Link href="/bookmarks" style={{ color: 'white', marginRight: '2rem' }}>Bookmark</Link>
          <button
            onClick={handleLogout}
          >
            Logout
          </button>
        </>

      )}
    </nav>
  );
}
