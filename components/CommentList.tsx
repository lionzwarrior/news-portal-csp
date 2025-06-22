'use client';

import { Comment } from '@/app/global';

export default function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-emerald-700 mb-4">Komentar</h3>
      {comments.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada komentar.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium text-gray-700">{comment.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-gray-800 text-base leading-relaxed">{comment.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
