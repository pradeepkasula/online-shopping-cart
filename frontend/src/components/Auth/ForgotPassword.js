import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import './Auth.css';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userService.forgotPassword(username);
      setTempPassword(response.tempPassword);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate temporary password');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/change-password', { state: { username, requireChange: true } });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        
        {!tempPassword ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Enter Your Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Get Temporary Password'}
            </button>
          </form>
        ) : (
          <div className="temp-password-display">
            <div className="success-message">
              <p>Your temporary password has been generated:</p>
              <div className="temp-password-box">
                <strong>{tempPassword}</strong>
              </div>
              <p className="warning-text">
                ⚠️ This password will expire in 15 minutes. Please save it and use it to change your password.
              </p>
            </div>
            <button onClick={handleContinue} className="btn-primary">
              Continue to Change Password
            </button>
          </div>
        )}

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
