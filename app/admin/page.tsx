"use client"

import { useEffect, useState } from 'react';
import { categories, News } from '../global';
import axios from 'axios';

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function AdminPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [formData, setFormData] = useState({ title: '', body: '', category: '' });
  const [editId, setEditId] = useState("");

  async function fetchNews(category: string) {
    const news: News[] = await getNews();
    if (category) {
      const filteredNews = news.filter(news => news.category.toLowerCase() === category.toLowerCase())
      setNewsList(filteredNews);
    } else {
      setNewsList(news);
    }
  }

  useEffect(() => {
    fetchNews("");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/news/${editId}`, formData);
    } else {
      await axios.post('http://localhost:5000/news', formData);
    }
    setFormData({ title: '', body: '', category: '' });
    setEditId("");
    fetchNews("");
  };

  const handleEdit = (item: News) => {
    setEditId(item.id);
    setFormData({ title: item.title, body: item.body, category: item.category });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/news/${id}`);
    fetchNews("");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin - Kelola Berita</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Judul"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Isi berita"
          value={formData.body}
          onChange={e => setFormData({ ...formData, body: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Tambah'} Berita</button>
      </form>

      <ul>
        {newsList.map(item => (
          <li key={item.id}>
            <strong>{item.title}</strong> - {item.category}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
