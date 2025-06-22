"use client";

import React, { useState, useEffect, SyntheticEvent } from 'react';
import { News, User } from '@/app/global';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function NewsCard({ news, user, setNews, setUser }: {
  news: News;
  user: User | null;
  setNews: React.Dispatch<React.SetStateAction<any[]>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  async function handleLikes(e: SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      setIsMutating(true);
      await axios.patch(`http://localhost:5000/news/${news.id}`, {
        likes: news.likes + 1
      });
      const { data: updatedNews } = await axios.get("http://localhost:5000/news");
      setNews(updatedNews);
      setIsMutating(false);
    } else {
      alert("You have to login first to like a news.")
    }
  }

  async function handleBookmark(e: SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      setIsMutating(true);

      const bookmarkedList = user?.bookmarks;

      if (user?.bookmarks?.includes(news.id)) {
        await axios.patch(`http://localhost:5000/news/${news.id}`, {
          bookmarks: news.bookmarks - 1,
        });
        if (bookmarkedList) {
          const updatedBookmarks = bookmarkedList.filter(id => id !== news.id);
          await axios.patch(`http://localhost:5000/user/${user.id}`, {
            bookmarks: updatedBookmarks,
          });
        }
      } else {
        await axios.patch(`http://localhost:5000/news/${news.id}`, {
          bookmarks: news.bookmarks + 1,
        });
        if (bookmarkedList) {
          const updatedBookmarks = [...bookmarkedList, news.id];
          await axios.patch(`http://localhost:5000/user/${user.id}`, {
            bookmarks: updatedBookmarks,
          });
        }
      }

      const [{ data: updatedNews }, { data: updatedUser }] = await Promise.all([
        axios.get("http://localhost:5000/news"),
        axios.get(`http://localhost:5000/user/${user.id}`),
      ]);
      setNews(updatedNews);
      setUser(updatedUser);

      setBookmarked(!bookmarked);
      setIsMutating(false);
    } else {
      alert("You have to login first to bookmark a news.")
    }
  }

  useEffect(() => {
    if (user?.bookmarks.includes(news.id)) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [user, news.id]);

  const handleCardClick = () => {
    if (user) {
      router.push(`/news/${news.id}`);
    } else {
      alert("You have to login first to view the news.")
    }

  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition cursor-pointer">
      <img
        src={news.image || "https://placehold.co/600x400/EEE/31343C"}
        alt="news"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{news.title}</h3>
          <p className="text-gray-700 text-sm">{news.description?.substring(0, 100)}...</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleLikes}
            disabled={isMutating}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-black shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>👍</span><span>{news.likes}</span>
          </button>
          <button
            onClick={handleBookmark}
            disabled={isMutating}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${bookmarked ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'} text-black shadow transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>📌</span>
            <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
