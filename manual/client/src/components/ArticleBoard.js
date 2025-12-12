import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

function ArticleBoard({ user, token, onLogout }) {
  const [articles, setArticles] = useState([]);
  const [articleUrl, setArticleUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

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

  const validateUrl = (url) => {
    try {
      // Ensure URL has a protocol
      let urlToValidate = url.trim();
      if (!urlToValidate.match(/^https?:\/\//i)) {
        urlToValidate = 'https://' + urlToValidate;
      }
      new URL(urlToValidate);
      return urlToValidate;
    } catch (e) {
      return null;
    }
  };

  const handlePostArticle = async (e) => {
    e.preventDefault();
    setPostError('');
    setPostSuccess('');
    
    if (!articleUrl.trim()) {
      setPostError('Please enter a URL');
      return;
    }

    const validatedUrl = validateUrl(articleUrl);
    if (!validatedUrl) {
      setPostError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: validatedUrl })
      });

      const data = await response.json();
      if (response.ok) {
        setArticleUrl('');
        setPostSuccess('Article posted successfully!');
        loadArticles();
        // Clear success message after 3 seconds
        setTimeout(() => setPostSuccess(''), 3000);
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          setPostError(data.errors.map(err => err.msg || err.message).join(', '));
        } else {
          setPostError(data.error || 'Failed to post article');
        }
      }
    } catch (error) {
      setPostError('Connection error. Please check if the server is running.');
    } finally {
      setIsPosting(false);
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
      <p>Logged in as: <strong>{user?.username}</strong> {user?.isAdmin && <span>(Admin)</span>}</p>
      <button onClick={onLogout}>Logout</button>

      <h2>Post Article</h2>
      <form onSubmit={handlePostArticle}>
        <input
          type="text"
          placeholder="Article URL (e.g., https://example.com/article)"
          value={articleUrl}
          onChange={(e) => {
            setArticleUrl(e.target.value);
            setPostError('');
            setPostSuccess('');
          }}
          disabled={isPosting}
        />
        {postError && <div className="error">{postError}</div>}
        {postSuccess && <div className="success">{postSuccess}</div>}
        <button type="submit" disabled={isPosting || !articleUrl.trim()}>
          {isPosting ? 'Posting...' : 'Post Article'}
        </button>
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

