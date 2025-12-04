# Manual Implementation - Article Share

Basic article sharing web application with React frontend and SQLite database backend.

## Setup

1. Install all dependencies (backend + frontend):
```bash
npm run install-all
```

2. Start both server and React app:
```bash
npm run dev
```

Or start them separately:
```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - React frontend
npm run client
```

3. Open browser to `http://localhost:3000` (React app)
   - Backend API runs on `http://localhost:5000`

## Default Admin Account
- Username: `admin`
- Password: `admin`

## Features
- User registration and login
- Post article URLs
- View all articles
- Delete your own articles
- Admin can delete any article

## Project Structure
- `server/` - Node.js/Express backend with SQLite
- `client/` - React frontend
  - `src/components/` - React components (Login, Register, ArticleBoard)
  - `src/App.js` - Main React app component

## Database
SQLite database file: `server/database/articles.db`
