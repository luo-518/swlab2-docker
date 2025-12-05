// frontend/src/AuthContext.jsx
 import React, { createContext, useState, useEffect } from 'react';
 import axios from 'axios';

 export const AuthContext = createContext({
   token: null,
   setToken: () => {},
 });

 export function AuthProvider({ children }) {

  // 从 sessionStorage 读取 ⇒ 只在当前会话（标签页/窗口）内有效
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(sessionStorage.getItem('user'));

   // token 改变时，写回 storage 并设置 axios header
   useEffect(() => {
     if (token) {

       sessionStorage.setItem('token', token);
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       sessionStorage.setItem('user', user);
     } else {

       sessionStorage.removeItem('token');
       delete axios.defaults.headers.common['Authorization'];
       sessionStorage.removeItem('user');
     }
   }, [token, user]);

   return (
     <AuthContext.Provider value={{ token, user, setToken, setUser }}>
       {children}
     </AuthContext.Provider>
   );
 }

