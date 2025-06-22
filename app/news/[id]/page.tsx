'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!id || !userId) return;

    const fetchData = async () => {
      try {
        const [{ data: newsData }, { data: userData }] = await Promise.all([
          axios.get(`http://localhost:5000/news/${id}`),
          axios.get(`http://localhost:5000/user/${userId}`)
        ]);
        setNews(newsData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

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

  if (loading || !news) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
      <img
        src={news.image || 'https://placehold.co/800x400'}
        alt="news"
        className="w-full h-auto rounded-lg mb-4"
      />
      <p className="mb-4 text-gray-700">{news.description}</p>

      <div className="flex gap-4 mb-6">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">👍 {news.likes}</button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">🔖 {news.bookmarks}</button>
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
