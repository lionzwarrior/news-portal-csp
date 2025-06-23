'use client';

import { useParams, useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { News, User } from '@/app/global';
import { getUserId } from '@/context/UserContext';
import { v4 as uuidv4 } from 'uuid';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { id: userId } = getUserId();
  const [news, setNews] = useState<News | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!userId || !id) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [{ data: newsData }, { data: userData }] = await Promise.all([
          axios.get(`http://localhost:5000/news/${id}`),
          axios.get(`http://localhost:5000/user/${userId}`)
        ]);
        setNews(newsData);
        setUser(userData);

        if (userData.bookmarks.includes(id)) {
          setBookmarked(true)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId, router]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!news || !user || !commentText.trim()) return;

    const newComment = {
      id: uuidv4(),
      text: commentText.trim(),
      username: user.username,
    };

    const updatedComments = [...(news.comments || []), newComment];

    try {
      await axios.patch(`http://localhost:5000/news/${news.id}`, {
        comments: updatedComments
      });
      setNews({ ...news, comments: updatedComments });
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  async function handleLikes(e: SyntheticEvent) {
    e.preventDefault();

    if (news) {
      setIsMutating(true);
      await axios.patch(`http://localhost:5000/news/${news.id}`, {
        likes: news.likes + 1
      });
      const { data: updatedNews } = await axios.get(`http://localhost:5000/news/${news.id}`);
      setNews(updatedNews);
      setIsMutating(false);
    } else {
      alert("current news is not found")
    }
  }

  async function handleBookmark(e: SyntheticEvent) {
    e.preventDefault();

    if (news && user) {
      setIsMutating(true);

      const bookmarkedList = user.bookmarks || [];

      if (bookmarkedList.includes(news.id)) {
        await axios.patch(`http://localhost:5000/news/${news.id}`, {
          bookmarks: Math.max((news.bookmarks || 1) - 1, 0),
        });

        const updatedBookmarks = bookmarkedList.filter((nid) => nid !== news.id);

        await axios.patch(`http://localhost:5000/user/${user.id}`, {
          bookmarks: updatedBookmarks,
        });

        setBookmarked(false);
      } else {
        await axios.patch(`http://localhost:5000/news/${news.id}`, {
          bookmarks: (news.bookmarks || 0) + 1,
        });

        const updatedBookmarks = [...bookmarkedList, news.id];

        await axios.patch(`http://localhost:5000/user/${user.id}`, {
          bookmarks: updatedBookmarks,
        });

        setBookmarked(true);
      }

      const [{ data: updatedNews }, { data: updatedUser }] = await Promise.all([
        axios.get(`http://localhost:5000/news/${news.id}`),
        axios.get(`http://localhost:5000/user/${user.id}`),
      ]);

      setNews(updatedNews);
      setUser(updatedUser);

      setIsMutating(false);
    } else {
      alert("Either news or user can't be found.");
    }
  }


  if (loading || !news) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
      <img
        src={news.image || 'https://placehold.co/800x400'}
        alt="news"
        className="w-full h-auto rounded-lg mb-4"
      />
      <p className="mb-4 text-gray-700">Category: {news.category}</p>
      <p className="mb-4 text-gray-700">Author: {news.author}</p>
      <p className="mb-4 text-gray-700">{news.body}</p>

      <div className="flex gap-4 mb-6">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" disabled={isMutating} onClick={handleLikes}>👍 {news.likes}</button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded" disabled={isMutating} onClick={handleBookmark}>🔖 {news.bookmarks} {bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Komentar</h2>
        {news.comments && news.comments.length > 0 ? (
          <ul className="mb-4 space-y-3">
            {news.comments.map((comment) => (
              <li key={comment.id} className="bg-gray-100 p-3 rounded shadow">
                <div className="text-sm text-gray-600 font-semibold mb-1">{comment.username}</div>
                <div className="text-gray-800">{comment.text}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Belum ada komentar.</p>
        )}

        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mt-4">
          <textarea
            className="border border-gray-300 p-2 rounded resize-none"
            placeholder="Tulis komentar Anda..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="self-end bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Kirim Komentar
          </button>
        </form>
      </div>
    </div>
  );
}
