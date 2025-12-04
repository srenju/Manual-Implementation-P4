import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function ArticleBoard({ user, token, onLogout }) {
  const [articles, setArticles] = useState([]);
  const [articleUrl, setArticleUrl] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/articles`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const handlePostArticle = async (e) => {
    e.preventDefault();
    if (!articleUrl) return;

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
        alert(data.error || 'Failed to post article');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;

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

  return (
    <div>
      <h1>Article Share</h1>
      <p>Logged in as: <strong>{user?.username}</strong></p>
      <button onClick={onLogout}>Logout</button>

      <h2>Post Article</h2>
      <form onSubmit={handlePostArticle}>
        <input
          type="text"
          placeholder="Article URL"
          value={articleUrl}
          onChange={(e) => setArticleUrl(e.target.value)}
        />
        <button type="submit">Post Article</button>
      </form>

      <h2>Articles</h2>
      {articles.length === 0 ? (
        <p>No articles yet. Be the first to post!</p>
      ) : (
        articles.map(article => (
          <div key={article.id} className="article">
            <strong>{article.username}</strong> - {new Date(article.created_at).toLocaleString()}<br />
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.url}
            </a>
            {canDelete(article) && (
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteArticle(article.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ArticleBoard;

