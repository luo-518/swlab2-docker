import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';

export default function Profile() {
  const { user, setToken, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  
  useEffect(() => {
    if (!user) {
      nav('/login');
    }
  }, [user]);

  
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/my_posts');
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(data);
      } catch (err) {
        console.error('pull own post failed', err);
      }
    };
    load();
  }, []);

  
  const handleDelete = async postId => {
    if (!window.confirm('Do you want to delete？')) return;
    try {
      await axios.delete(`/post/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success('Delete successfully');
    } catch (err) {
      console.error('Fail to delete', err);
      toast.error('Failed, try again');
    }
  };

 
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    toast.info('Logout');
    nav('/login');
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h2 style={{ margin: 0 }}>{user} 's profile</h2>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 12px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      <Link to="/timeline">← Return to Timeline</Link>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {posts.map(p => (
          <li
            key={p._id}
            style={{
              padding: 12,
              borderBottom: '1px solid #ddd',
              position: 'relative'
            }}
          >
            
            <button
              onClick={() => handleDelete(p._id)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                border: 'none',
                background: 'transparent',
                color: 'red',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>

            
            <div style={{ marginBottom: 6, color: '#888' }}>
              {new Date(p.timestamp).toLocaleString()}
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

            
            <div>👍 {p.likes}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

