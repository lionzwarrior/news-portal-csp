'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../../components/news-card";
import { User, News } from "../global";
import { getUserId } from "@/context/UserContext";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<User | null>(null);
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

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Loading bookmarked news...</p>;
  }

  const count = bookmarkedNews.length;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">
        📌 {count} Berita yang Telah di-Bookmark
      </h2>
      {count > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedNews.map((news) => (
            <NewsCard
              user={user}
              news={news}
              setNews={setNewsList}
              setUser={setUser}
              key={news.id}
              {...news}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Belum ada berita yang di-bookmark.</p>
      )}
    </div>
  );
}
