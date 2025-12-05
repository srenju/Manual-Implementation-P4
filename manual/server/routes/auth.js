const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDb();

  // Check if user already exists
  db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and create user
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', 
        [username, passwordHash], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, username },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { 
              id: this.lastID, 
              username,
              isAdmin: false // New users are not admin
            }
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDb();

  db.get('SELECT id, username, password_hash, is_admin FROM users WHERE username = ?', 
    [username], 
    async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, row.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: row.id, username: row.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: row.id,
          username: row.username,
          isAdmin: row.is_admin === 1
        }
      });
    }
  );
});

// Get current user info (verify token)
router.get('/me', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.get('SELECT id, username, is_admin FROM users WHERE id = ?', 
    [req.user.userId], 
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: row.id,
          username: row.username,
          isAdmin: row.is_admin === 1
        }
      });
    }
  );
});

module.exports = router;

