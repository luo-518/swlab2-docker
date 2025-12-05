import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PostForm({ onPost }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.warn('Input words or choose pictures first');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('text', text);
      if (file) fd.append('image', file);

      await axios.post('/post', fd, {
        headers: {
          // 重写 Content-Type，让浏览器自己带 boundary
          'Content-Type': 'multipart/form-data'
        }
      });

      setText('');
      setFile(null);
      toast.success('Post Successfully');
      onPost && onPost();
    } catch (err) {
      console.error(err);
      toast.error('Post fail，Please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#f5f7fa',
      borderRadius: 8,
      padding: 12,
      marginBottom: 24
    }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Anything interesting would like to share with others？"
        style={{
          width: '100%',
          minHeight: 80,
          border: 'none',
          resize: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 14,
          color: '#333'
        }}
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'space-between'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#666'
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 20, height: 20, marginRight: 4 }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          图片
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? '#ccc' : '#FFA500',
            border: 'none',
            borderRadius: 4,
            padding: '6px 16px',
            color: '#fff',
            cursor: submitting ? 'default' : 'pointer'
          }}
        >
          {submitting ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </form>
  );
}

