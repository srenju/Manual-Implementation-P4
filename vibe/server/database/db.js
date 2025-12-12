const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'articles.db');

let db = null;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(() => {
        createAdminUser().then(resolve).catch(reject);
      }).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

      // Articles table
      db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Error creating articles table:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
};

const createAdminUser = async () => {
  return new Promise((resolve, reject) => {
    // Check if admin already exists
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        // Create admin user
        const passwordHash = await bcrypt.hash('admin', 10);
        db.run(
          'INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)',
          ['admin', passwordHash, 1],
          (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
              reject(err);
              return;
            }
            console.log('Admin user created (username: admin, password: admin)');
            resolve();
          }
        );
      } else {
        console.log('Admin user already exists');
        resolve();
      }
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  initDatabase,
  getDb,
  closeDatabase
};

