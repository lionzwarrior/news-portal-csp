"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../../components/news-card";
import { User, News } from "../global";
import { getUserId } from "@/context/UserContext";
import { redirect, useRouter } from "next/navigation";

async function getUser(id: string | null) {
  const res = await axios.get(`http://localhost:5000/user/${id}`);
  return res.data;
}

async function getNews() {
  const res = await axios.get("http://localhost:5000/news");
  return res.data;
}

export default function BookmarkPage() {
  const { id: userId } = getUserId();
  const [user, setUser] = useState<User>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [bookmarkedNews, setBookmarkedNews] = useState<News[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedUser: User = await getUser(userId);
        const fetchedNews: News[] = await getNews();

        setUser(fetchedUser);
        setNewsList(fetchedNews);

        const filteredNews = fetchedNews.filter(news =>
          fetchedUser.bookmarks.includes(news.id)
        );
        setBookmarkedNews(filteredNews);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);


  return loading ? (<p>Loading bookmarked news...</p>) : (
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
