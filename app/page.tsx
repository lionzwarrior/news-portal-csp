"use client"

import { SetStateAction, useEffect, useState } from 'react';
import NewsCard from '../components/news-card';
import { categories, News, User } from './global';
import axios from 'axios';

async function getUser() {
  const res = await axios.get("http://localhost:5000/user/1")
  return res.data;
}

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function HomePage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [user, setUser] = useState<User>();

  async function fetchNews(category: string) {
    const news: News[] = await getNews();
    if (category) {
      const filteredNews = news.filter(news => news.category.toLowerCase() === category.toLowerCase())
      setNewsList(filteredNews);
    } else {
      setNewsList(news);
    }
  }

  async function fetchUser() {
    const user: User = await getUser();
    setUser(user);
  }

  useEffect(() => {
    fetchNews("");
    fetchUser();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Berita Terbaru</h1>
      <select onChange={e => {
        if (e.target.value) { }
        fetchNews(e.target.value);
      }}>
        <option value="">Semua Kategori</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
        ))}
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {newsList.map(news => <NewsCard user={user ? user : {
          id: "",
          name: "",
          userType: "",
          username: "",
          password: "",
          bookmarks: []
        }} news={news} setNews={setNewsList} setUser={setUser} key={news.id} {...news} />)}
      </div>
    </div>
  );
}
