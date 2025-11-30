import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productService from '../../services/productService';
import './ProductList.css';
import { useCart } from '../../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-list-container">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p className="no-products">No products available</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            // Check if product is in cart
            const cartItem = cart.items.find(item => item.productId === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                inCart={!!cartItem}
                cartQuantity={cartItem ? cartItem.quantity : 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
