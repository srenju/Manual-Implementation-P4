import React, { useState, useEffect } from 'react';
import './ArticleBoard.css';

const API_URL = 'http://localhost:5002/api';

function ArticleBoard({ user, token, onLogout }) {
  const [articles, setArticles] = useState([]);
  const [articleUrl, setArticleUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/articles`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handlePostArticle = async (e) => {
    e.preventDefault();
    if (!articleUrl) return;

    setPosting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: articleUrl })
      });

      const data = await response.json();
      if (response.ok) {
        setArticleUrl('');
        loadArticles();
      } else {
        setError(data.error || 'Failed to post article');
      }
    } catch (error) {
      setError('Connection error');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`${API_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        loadArticles();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const canDelete = (article) => {
    return user && (user.id === article.user_id || user.isAdmin);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="article-board">
      <header className="board-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="board-title">Vibe Articles</h1>
            <p className="board-subtitle">Share and discover amazing content</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="username">{user?.username}</span>
                {user?.isAdmin && <span className="admin-badge">Admin</span>}
              </div>
            </div>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="board-main">
        <div className="post-section">
          <div className="post-card">
            <h2 className="post-title">Share an Article</h2>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            <form onSubmit={handlePostArticle} className="post-form">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Paste article URL here..."
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  className="post-input"
                  disabled={posting}
                />
                <button 
                  type="submit" 
                  className="post-button"
                  disabled={posting || !articleUrl}
                >
                  {posting ? (
                    <span className="button-loading">
                      <span className="spinner"></span>
                      Posting...
                    </span>
                  ) : (
                    'Post Article'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="articles-section">
          <h2 className="section-title">
            Articles
            {articles.length > 0 && (
              <span className="article-count">({articles.length})</span>
            )}
          </h2>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📰</div>
              <h3>No articles yet</h3>
              <p>Be the first to share something amazing!</p>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article, index) => (
                <div 
                  key={article.id} 
                  className="article-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="article-header">
                    <div className="article-user">
                      <div className="article-avatar">
                        {article.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="article-username">{article.username}</div>
                        <div className="article-time">{formatDate(article.created_at)}</div>
                      </div>
                    </div>
                    {canDelete(article) && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteArticle(article.id)}
                        title="Delete article"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <div className="article-content">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-link"
                    >
                      {article.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArticleBoard;

