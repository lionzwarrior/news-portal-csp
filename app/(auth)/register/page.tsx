'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/context/UserContext';
import { User } from '@/app/global';

export default function RegisterPage() {
  const { id: userId } = getUserId();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const username = formData.get("username");
    const password = formData.get("password");

    if (!users.find(user => user.username === username)) {
      try {
        await axios.post('http://localhost:5000/user', {
          name: String(name),
          username: String(username),
          password: String(password),
          userType: "user",
          bookmarks: []
        });
        router.push('/login');
      } catch (err) {
        alert('Register failed');
      }
    } else {
      alert('User with that username already existed');
    }
  };

  useEffect(() => {
    if (userId) {
      router.push('/');
    }

    const fetchUsers = async () => {
      const res = await axios.get<User[]>('http://localhost:5000/user');
      setUsers(res.data);
    };
    fetchUsers();
  }, [userId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Register</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold text-gray-800">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="border border-gray-3000 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-semibold text-gray-800">Username</label>
            <input
              id="username"
              name="username"
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
              name="password"
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
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium text-lg py-3 rounded-lg shadow-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
