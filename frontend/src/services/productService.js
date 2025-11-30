import { productApi } from './api';

const productService = {
  getAllProducts: async () => {
    const response = await productApi.get('/api/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await productApi.get(`/api/products/${id}`);
    return response.data;
  },

  createProduct: async (product) => {
    const response = await productApi.post('/api/products', product);
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await productApi.put(`/api/products/${id}/stock`, { stock });
    return response.data;
  },
};

export default productService;
