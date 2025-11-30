import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      setQuantity(newQuantity);
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      setQuantity(item.quantity);
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h3>{item.productName}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={updating || quantity <= 1}
          >
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={updating}
          >
            +
          </button>
        </div>
        <p className="cart-item-subtotal">${item.subtotal.toFixed(2)}</p>
        <button className="remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
