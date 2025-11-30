import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing session when login page loads
    logout();
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userService.login(username, password);
      
      if (response.token) {
        // Store token first so subsequent API calls can use it
        localStorage.setItem('token', response.token);
        
        // Fetch user details with the new token
        try {
          const userData = await userService.getUser();
          login(response.token, userData);
          navigate('/products');
        } catch (userErr) {
          // If fetching user fails, still login with basic info
          console.error('Failed to fetch user details:', userErr);
          login(response.token, { username });
          navigate('/products');
        }
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.error === 'Password change required') {
        // Redirect to change password
        navigate('/change-password', { state: { username, requireChange: true } });
      } else if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
