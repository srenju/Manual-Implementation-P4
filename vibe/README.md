# Vibe - Article Share

**Stunning UI version** of the article sharing web application with beautiful orange gradient theme and modern design.

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
   - Backend API runs on `http://localhost:5002`

## Default Admin Account
- Username: `admin`
- Password: `admin`

## Features
- ✨ **Stunning UI** with orange gradient theme
- 🎨 Modern glassmorphism design
- 🌊 Smooth animations and transitions
- 📱 Fully responsive design
- 🔐 User registration and login
- 📰 Post article URLs
- 👀 View all articles
- 🗑️ Delete your own articles
- 👑 Admin can delete any article

## Project Structure
- `server/` - Node.js/Express backend with SQLite
- `client/` - React frontend with beautiful UI
  - `src/components/` - React components (Login, Register, ArticleBoard)
  - `src/App.js` - Main React app component

## Database
SQLite database file: `server/database/articles.db`

## Design Highlights
- Animated gradient backgrounds
- Glassmorphism effects
- Smooth hover animations
- Beautiful card designs
- Modern typography
- Responsive grid layouts

