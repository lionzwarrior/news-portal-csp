'use client';

import { useState } from 'react';
import axios from 'axios';
import { User, Comment } from '@/app/global';
import { v4 as uuidv4 } from 'uuid';

export default function CommentModal({
  newsId,
  user,
  onClose,
  onCommentAdded
}: {
  newsId: string;
  user: User;
  onClose: () => void;
  onCommentAdded: (comment: Comment) => void;
}) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newComment: Comment = {
      id: uuidv4(),
      newsId,
      username: user.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:5000/comments', newComment);
      onCommentAdded(newComment);
      setCommentText('');
      onClose();
    } catch (err) {
      alert('Gagal mengirim komentar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-neutral-50 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tulis Komentar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            rows={4}
            required
          ></textarea>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
