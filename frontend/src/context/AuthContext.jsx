import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('shopwave_session');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const users = JSON.parse(localStorage.getItem('shopwave_users') || '[]');
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) throw new Error('Invalid username or password');
    const session = { username: found.username, name: found.name, email: found.email };
    setUser(session);
    localStorage.setItem('shopwave_session', JSON.stringify(session));
    return session;
  };

  const register = async (username, password, name, email) => {
    const users = JSON.parse(localStorage.getItem('shopwave_users') || '[]');
    if (users.find(u => u.username === username)) throw new Error('Username already exists');
    const newUser = { username, password, name, email };
    users.push(newUser);
    localStorage.setItem('shopwave_users', JSON.stringify(users));
    const session = { username, name, email };
    setUser(session);
    localStorage.setItem('shopwave_session', JSON.stringify(session));
    return session;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopwave_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
