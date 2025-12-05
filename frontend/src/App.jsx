import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline';
import Profile from './components/Profile';

function App() {
  const { token } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/timeline" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/timeline" replace />}
        />
        <Route
          path="/timeline"
          element={token ? <Timeline /> : <Navigate to="/login" replace />}
        />
	<Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
        {/* 默认根路径也导到 login 或 timeline */}
        <Route
          path="/"
          element={<Navigate to={token ? '/timeline' : '/login'} replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
