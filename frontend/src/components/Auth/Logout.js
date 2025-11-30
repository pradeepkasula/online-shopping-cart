import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout when component mounts
    logout();
  }, [logout]);

  const handleLoginAgain = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Logged Out Successfully</h2>
        <div className="logout-message">
          <p>You have been successfully logged out.</p>
          <p>Thank you for using our shopping cart!</p>
        </div>
        
        <button onClick={handleLoginAgain} className="btn-primary">
          Login Again
        </button>
        
        <div className="auth-links">
          <Link to="/signup">Create a new account</Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
