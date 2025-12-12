import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ArticleBoard from './components/ArticleBoard';

const API_URL = 'http://localhost:5002/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      verifyTokenAndRestoreUser(savedToken);
    }
  }, []);

  const verifyTokenAndRestoreUser = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(authToken);
        setIsLoggedIn(true);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setToken(null);
      setIsLoggedIn(false);
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

