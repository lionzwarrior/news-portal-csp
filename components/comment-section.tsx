import { useState } from 'react';
import { UpdateNews } from '@/app/global';

export default function CommentSection({ news }: UpdateNews) {
  const [comments, setComments] = useState(news.comments);
  const [comment, setComment] = useState('');

  const submitComment = () => {
    if (comment.trim() === '') return;
    setComments([...comments, { id: Date.now().toString(), text: comment }]);
    setComment('');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Komentar</h4>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        cols={40}
        placeholder="Tulis komentar..."
      />
      <br />
      <button onClick={submitComment}>Kirim</button>

      {comments.map(c => (
        <p key={c.id} style={{ background: '#eee', padding: '0.5rem', borderRadius: '5px' }}>{c.text}</p>
      ))}
    </div>
  );
}
