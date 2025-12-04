# React Code Guide

This is a basic React setup so you can learn and modify it yourself!

## File Structure

```
client/
├── public/
│   └── index.html          # Main HTML file (React mounts here)
├── src/
│   ├── index.js            # Entry point - renders App component
│   ├── index.css           # Global styles
│   ├── App.js              # Main app component (handles login state)
│   ├── App.css             # App styles
│   └── components/
│       ├── Login.js        # Login form component
│       ├── Register.js     # Registration form component
│       └── ArticleBoard.js # Article list and posting component
```

## Key React Concepts Used

### 1. **Components** (`Login.js`, `Register.js`, `ArticleBoard.js`)
- Each file is a React component (like a reusable UI piece)
- Components return JSX (HTML-like syntax)

### 2. **useState Hook** (in all components)
```javascript
const [username, setUsername] = useState('');
```
- Stores component state (data that can change)
- `username` = current value
- `setUsername` = function to update it

### 3. **useEffect Hook** (in `App.js` and `ArticleBoard.js`)
```javascript
useEffect(() => {
  loadArticles();
}, []);
```
- Runs code when component loads
- Empty `[]` means "run once on mount"

### 4. **Props** (passing data between components)
```javascript
<Login onLogin={handleLogin} />
```
- Parent (`App.js`) passes functions/data to child (`Login.js`)
- Child calls `onLogin()` to communicate back

## How to Modify

1. **Change styling**: Edit `App.css` or add styles to components
2. **Add features**: Create new components in `components/` folder
3. **Modify login**: Edit `Login.js` - it's just a form with state!
4. **Change layout**: Edit `App.js` - it controls what shows when

## Start Learning

Try these modifications:
- Add a "Remember me" checkbox to Login
- Add article titles (not just URLs)
- Add a search/filter for articles
- Style it better with CSS

The code is simple and commented - perfect for learning!

