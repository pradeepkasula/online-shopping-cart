import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // For demo purposes, using a fixed user ID
  const userId = 1;

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart(userId);
      setCart(cartData);
      setCartCount(cartData.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.addItem(userId, productId, quantity);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.updateItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart(userId);
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    cartCount,
    loading,
    error,
    userId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
