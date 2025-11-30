import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error } = useCart();

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {isEmpty ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
