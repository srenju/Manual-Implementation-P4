const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  const db = getDb();
  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row || !row.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  isAdmin,
  JWT_SECRET
};

