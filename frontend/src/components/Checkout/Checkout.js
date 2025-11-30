import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, userId, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isEmpty = !cart.items || cart.items.length === 0;

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      setError(null);

      const orderItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await orderService.createOrder(userId, orderItems);
      await clearCart();
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setPlacing(false);
    }
  };

  if (isEmpty && !success) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart before checking out.</p>
          <button onClick={() => navigate('/products')}>Go to Products</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <h2>✓ Order Placed Successfully!</h2>
          <p>Thank you for your order. You will be redirected to the products page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <h3>{item.productName}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="order-item-price">${item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span className="total-amount">${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="checkout-actions">
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          <button className="back-to-cart-btn" onClick={() => navigate('/cart')}>
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
