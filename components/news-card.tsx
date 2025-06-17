"use client"

import React, { useState, useEffect, SyntheticEvent } from 'react';
import './news-card.css';
import { UpdateNews } from '@/app/global';
import axios from 'axios';

export default function NewsCard({ news, user, setNews, setUser }: UpdateNews) {
  const [bookmarked, setBookmarked] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  async function handleLikes(e: SyntheticEvent) {
    e.preventDefault();
    setIsMutating(true);
    await axios.patch(`http://localhost:5000/news/${news.id}`, {
      likes: news.likes + 1
    });
    const { data: updatedNews } = await axios.get("http://localhost:5000/news");
    setNews(updatedNews);
    setIsMutating(false);
  }

  async function handleBookmark(e: SyntheticEvent) {
    e.preventDefault();
    setIsMutating(true);

    const bookmarkedList = user?.bookmarks;

    if (user?.bookmarks?.includes(news.id)) {
      await axios.patch(`http://localhost:5000/news/${news.id}`, {
        bookmarks: news.bookmarks - 1,
      });
      if (bookmarkedList) {
        const updatedBookmarks = bookmarkedList.filter(id => id !== news.id);
        await axios.patch(`http://localhost:5000/user/1`, {
          bookmarks: updatedBookmarks,
        });
      }
    } else {
      await axios.patch(`http://localhost:5000/news/${news.id}`, {
        bookmarks: news.bookmarks + 1,
      });
      if (bookmarkedList) {
        const updatedBookmarks = [...bookmarkedList, news.id];
        await axios.patch(`http://localhost:5000/user/1`, {
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

    setBookmarked(!bookmarked)
    setIsMutating(false);
  }

  useEffect(() => {
    if (user?.bookmarks.includes(news.id)) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [user, news.id]);

  return (
    <div className="card">
      <img
        src={news.image || "https://placehold.co/600x400/EEE/31343C"}
        alt="news"
        className="card-img"
      />
      <div className="card-body">
        <div className="card-content">
          <h3>{news.title}</h3>
          <p>{news.description?.substring(0, 100)}...</p>
        </div>
        <div className="card-footer">
          <div className="card-actions">
            <button onClick={handleLikes} disabled={isMutating}>👍 {news.likes}</button>
            <button onClick={handleBookmark} disabled={isMutating}>
              {bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
