import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostForm from './PostForm';
import { AuthContext } from '../AuthContext';

export default function Timeline() {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState('public');
  const [posts, setPosts] = useState([]);


  const load = async () => {
    const url = view === 'mine' ? '/my_posts' : '/timeline';
    const { data } = await axios.get(url);
    setPosts(data);
  };

  useEffect(() => {
  const load = async () => {
    try {
      const url = view === 'mine' ? '/my_posts' : '/timeline';
      const { data } = await axios.get(url);
      console.log('pulled posts:', data);
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };
  load();
}, [view]);

  const handleLike = async id => {
    await axios.post('/like', { _id: id });
    setPosts(ps => ps.map(p => p._id===id ? { ...p, likes: p.likes+1 } : p));
  };

  return (
    <div style={{ padding: 16 }}>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <span>Hi, {user}</span>
        <Link to="/profile">Profile</Link>
      </div>

      
      <div style={{ marginBottom: 16 }}>
        <button disabled={view==='public'} onClick={()=>setView('public')} style={{ marginRight: 8 }}>
          Timeline
        </button>
        <button disabled={view==='mine'} onClick={()=>setView('mine')}>
          My Post
        </button>
      </div>
      {view==='public' && <PostForm onPost={() => setView('mine')} />}

      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(p => (
          <li key={p._id} style={{
            padding: 12,
            borderBottom: '1px solid #ddd'
          }}>
            <div style={{ marginBottom: 6 }}>
              <strong>{p.username}</strong>
              <span style={{ marginLeft: 8, color: '#888' }}>
                {new Date(p.timestamp).toLocaleString()}
              </span>
            </div>

            
            <p style={{ marginBottom: 8, lineHeight: 1.5 }}>
              {p.text}
            </p>

            {p.image && (
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt=""
                style={{ maxWidth: 200, display: 'block', margin: '8px 0' }}
              />
            )}

            <button onClick={()=>handleLike(p._id)}>
              👍 {p.likes}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

