import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      setMessage('');
      await addToCart(product.id, 1);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className={`product-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </p>
        </div>
        {message && <p className="cart-message">{message}</p>}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
        >
          {adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
