'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import '../../globals.css';

export default function LoginPage() {
  const { id: userId } = getUserId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/login', { username, password });
      window.location.href = "/";
    } catch (err) {
      alert('Login failed');
    }
  };

  useEffect(() => {
    if (userId) {
      router.push("/");
    }
  }, [userId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-semibold text-gray-800">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="border border-gray-3000 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-semibold text-gray-800">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border border-gray-3000 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg py-3 rounded-lg shadow-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
