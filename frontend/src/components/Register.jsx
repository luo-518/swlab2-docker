import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const { setUser } = useContext(AuthContext);

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('/register', { username, password });
      toast.success('Register Successfully, Pleasr login');
      setUser(username);
      nav('/login');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Username is exist');
      } else {
        toast.error('Register fail，Please try again');
      }
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 320, margin: '0 auto' }}>
      <h2>Register</h2>
      <input
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
      <button type="submit" style={{ width: '100%', padding: 10 }}>Register</button>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Return to Login</Link>
      </p>
    </form>
  );
}

