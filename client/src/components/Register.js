import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        onRegister(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Connection error');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <button type="button" onClick={onSwitchToLogin}>Back to Login</button>
      </form>
    </div>
  );
}

export default Register;

