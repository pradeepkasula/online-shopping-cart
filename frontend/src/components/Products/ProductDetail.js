import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setMessage('');
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div className="error">Product not found</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate('/products')}>
        ← Back to Products
      </button>
      <div className="product-detail">
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className={`product-detail-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </p>
          {!isOutOfStock && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          )}
          {message && <p className="cart-message">{message}</p>}
          <button
            className="add-to-cart-btn-detail"
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
          >
            {adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
