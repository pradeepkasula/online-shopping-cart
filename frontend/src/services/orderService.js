import { orderApi } from './api';

const orderService = {
  createOrder: async (userId, items) => {
    const response = await orderApi.post('/api/orders', {
      userId,
      items,
    });
    return response.data;
  },

  getOrdersByUserId: async (userId) => {
    const response = await orderApi.get(`/api/orders/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await orderApi.get(`/api/orders/order/${orderId}`);
    return response.data;
  },
};

export default orderService;
