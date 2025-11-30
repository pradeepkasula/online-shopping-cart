import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Shopping Cart
        </Link>
        <div className="navbar-links">
          {isAuthenticated() && (
            <>
              <Link to="/products" className="nav-link">
                Products
              </Link>
              <Link to="/cart" className="nav-link cart-link">
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <span className="nav-user">
                Welcome, {user?.username || 'User'}
              </span>
              <Link to="/logout" className="nav-link logout-link">
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
