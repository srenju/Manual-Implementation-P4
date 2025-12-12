const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all articles
router.get('/', (req, res) => {
  const db = getDb();
  db.all(`SELECT a.id, a.url, a.title, a.created_at, u.username, u.id as user_id
          FROM articles a
          JOIN users u ON a.user_id = u.id
          ORDER BY a.created_at DESC`, 
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// Create article (requires authentication)
router.post('/', authenticateToken, [
  body('url')
    .notEmpty().withMessage('Article text is required')
    .trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { url, title } = req.body;
  
  // Just trim the text - no URL formatting needed
  url = url.trim();
  
  const db = getDb();

  db.run('INSERT INTO articles (user_id, url, title) VALUES (?, ?, ?)',
    [req.user.userId, url, title || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create article' });
      }
      res.status(201).json({
        id: this.lastID,
        url,
        title,
        message: 'Article posted successfully'
      });
    }
  );
});

// Delete article (user can delete own, admin can delete any)
router.delete('/:id', authenticateToken, (req, res) => {
  const articleId = req.params.id;
  const db = getDb();

  // First check if article exists and get owner info
  db.get('SELECT user_id FROM articles WHERE id = ?', [articleId], (err, article) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user is admin
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const isUserAdmin = user && user.is_admin === 1;
      const isOwner = article.user_id === req.user.userId;

      if (!isOwner && !isUserAdmin) {
        return res.status(403).json({ error: 'You can only delete your own articles' });
      }

      // Delete the article
      db.run('DELETE FROM articles WHERE id = ?', [articleId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete article' });
        }
        res.json({ message: 'Article deleted successfully' });
      });
    });
  });
});

module.exports = router;

