import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ArticleBoard from './components/ArticleBoard';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Try to load articles to verify token
      fetchArticles(savedToken);
    }
  }, []);

  const fetchArticles = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/articles`);
      if (response.ok) {
        // Token is valid, user is logged in
        // We'll get user info from login/register
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);
    setShowRegister(false);
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <ArticleBoard user={user} token={token} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="App">
      {showRegister ? (
        <Register 
          onRegister={handleLogin} 
          onSwitchToLogin={() => setShowRegister(false)} 
        />
      ) : (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setShowRegister(true)} 
        />
      )}
    </div>
  );
}

export default App;

