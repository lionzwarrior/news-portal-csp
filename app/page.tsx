"use client"

import { useEffect, useState } from 'react';
import NewsCard from '../components/news-card';
import { categories, News, User } from './global';
import axios from 'axios';
import "./globals.css";
import { getUserId } from '@/context/UserContext';

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function HomePage() {
  const userId = getUserId().id;
  const [newsList, setNewsList] = useState<News[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  const fetchUserAndNews = async () => {
    try {
      if (userId) {
        try {
          const res = await axios.get<User>(`http://localhost:5000/user/${userId}`);
          setUser(res.data);
        } catch (err) {
          console.warn("User not found or failed to fetch user:", err);
          setUser(null)
        }
      }

      await fetchNews("");
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUserAndNews();
}, [userId]);



  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold mb-4">Berita Terbaru</h1>
      <select
        onChange={e => fetchNews(e.target.value)}
        className="mb-6 p-2 border rounded-md shadow-sm"
      >
        <option value="">Semua Kategori</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
        ))}
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newsList.map(news => (
          <NewsCard
            key={news.id}
            user={user}
            news={news}
            setNews={setNewsList}
            setUser={setUser}
            {...news}
          />
        ))}
      </div>
    </div>
  );
}
