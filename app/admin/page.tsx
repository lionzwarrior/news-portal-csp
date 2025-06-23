"use client";

import { useEffect, useState } from 'react';
import { categories, News, User } from '../global';
import axios from 'axios';
import { getUserId } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function AdminPage() {
  const { id: userId } = getUserId();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', body: '', category: '', author: '', image: '' });
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNews = async (category: string) => {
    const news: News[] = await getNews();
    if (category) {
      const filtered = news.filter(n => n.category.toLowerCase() === category.toLowerCase());
      setNewsList(filtered);
    } else {
      setNewsList(news);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/news/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/news', formData);
      }
      setFormData({ title: '', description: '', body: '', category: '', author: '', image: '' });
      setEditId("");
      fetchNews("");
    } catch (err) {
      console.error("Failed to submit news:", err);
    }
  };

  const handleEdit = (item: News) => {
    setEditId(item.id);
    setFormData({ title: item.title, description: item.description, body: item.body, category: item.category, author: item.author, image: item.image });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/news/${id}`);
      fetchNews("");
    } catch (err) {
      console.error("Failed to delete news:", err);
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push('/');
      return;
    }

    const checkAccessAndLoad = async () => {
      try {
        const res = await axios.get<User>(`http://localhost:5000/user/${userId}`);
        if (res.data?.userType !== 'admin') {
          router.push('/');
          return;
        }
        await fetchNews("");
      } catch (err) {
        console.error("Access check failed:", err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoad();
  }, [userId, router]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-emerald-700">Admin - Kelola Berita</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-xl rounded-2xl p-6 mb-10">
        <input
          placeholder="Judul berita"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <textarea
          placeholder="Deskripsi berita"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <textarea
          placeholder="Isi berita"
          value={formData.body}
          onChange={e => setFormData({ ...formData, body: e.target.value })}
          required
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">Pilih Kategori</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          placeholder="Penulis berita"
          value={formData.author}
          onChange={e => setFormData({ ...formData, author: e.target.value })}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
          placeholder="Link gambar berita"
          value={formData.image}
          onChange={e => setFormData({ ...formData, image: e.target.value })}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {editId ? 'Update' : 'Tambah'} Berita
        </button>
      </form>

      <div className="space-y-4">
        {newsList.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-2 sm:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500 italic">{item.category}</p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white text-sm shadow"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm shadow"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
