"use client"

import { useEffect, useState, SetStateAction } from "react";
import axios from "axios";
import NewsCard from "../../components/news-card";
import { User, News } from "../global";

async function getUser() {
  const res = await axios.get('http://localhost:5000/user/1');
  return res.data;
}

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function BookmarkPage() {
  const [user, setUser] = useState<User>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [bookmarkedNews, setBookmarkedNews] = useState<News[]>([]);

  async function fetchUser() {
    const user: User = await getUser();
    setUser(user);
  }

  async function fetchNews() {
    const news: News[] = await getNews();
    setNewsList(news);
  }

  useEffect(() => {
    fetchUser()
    fetchNews()
    setBookmarkedNews(newsList.filter(news => user?.bookmarks.includes(news.id)))
  }, []);

  return (
    <div>
      <h2>📌 Berita yang Telah di-Bookmark</h2>
      {bookmarkedNews.map((news) => (
        <NewsCard user={user ? user : {
          id: "",
          name: "",
          userType: "",
          username: "",
          password: "",
          bookmarks: []
        }} news={news} setNews={setNewsList} setUser={setUser} key={news.id} {...news} />
      ))}
    </div>
  );
}
