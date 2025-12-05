import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const { setToken, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/login', { username, password });
      setToken(data.access_token);
      setUser(username);
      toast.success('Login Successfully');
      nav('/timeline');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Username or Password is wrong!');
      } else {
        toast.error('Login fail，try again later!');
      }
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 320, margin: '0 auto' }}>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        No Account？<Link to="/register">Register</Link>
      </p>
    </form>
  );
}

