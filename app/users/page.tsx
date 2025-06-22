"use client";

import { useEffect, useState } from 'react';
import { User } from '../global';
import axios from 'axios';
import { getUserId } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

async function getUsers() {
  const res = await axios.get("http://localhost:5000/user");
  return res.data;
}

export default function UsersPage() {
  const userId = getUserId().id;
  const [Users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    userType: "user",
    bookmarks: [],
  });
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function fetchUsers() {
    const users: User[] = await getUsers();
    setUsers(users);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isDuplicate = Users.find(user =>
      user.username === formData.username && user.id !== editId
    );

    if (isDuplicate) {
      setErrorMsg("Username sudah digunakan.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/user/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/user', formData);
      }
      setFormData({ name: '', username: '', password: '', userType: "user", bookmarks: [] });
      setEditId("");
      setErrorMsg("");
      fetchUsers();
    } catch {
      setErrorMsg("Gagal menyimpan data.");
    }
  };

  const handleEdit = (item: User) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      username: item.username,
      password: item.password,
      userType: "user",
      bookmarks: [],
    });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/user/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    if (!userId) {
      router.push('/');
      return;
    }

    const fetchUserAndData = async () => {
      try {
        const res = await axios.get<User>(`http://localhost:5000/user/${userId}`);
        if (res.data?.userType !== 'admin') {
          router.push('/');
          return;
        }
        await fetchUsers();
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, [userId, router]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-emerald-700 mb-8">Admin - Kelola Pengguna</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5 mb-10">
        {errorMsg && (
          <div className="text-red-600 text-sm font-medium">{errorMsg}</div>
        )}
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-700 transition"
        >
          {editId ? 'Update' : 'Tambah'} User
        </button>
      </form>

      <div className="space-y-4">
        {Users.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
              <p className="text-sm text-gray-500">@{item.username}</p>
            </div>
            {item.id !== userId && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-1.5 rounded-lg shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-1.5 rounded-lg shadow"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
