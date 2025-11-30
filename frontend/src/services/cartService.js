import { cartApi } from './api';

const cartService = {
  getCart: async (userId) => {
    const response = await cartApi.get(`/api/cart/${userId}`);
    return response.data;
  },

  addItem: async (userId, productId, quantity) => {
    const response = await cartApi.post('/api/cart/items', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  updateItem: async (itemId, quantity) => {
    const response = await cartApi.put(`/api/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  removeItem: async (itemId) => {
    await cartApi.delete(`/api/cart/items/${itemId}`);
  },

  clearCart: async (userId) => {
    await cartApi.delete(`/api/cart/${userId}`);
  },
};

export default cartService;
