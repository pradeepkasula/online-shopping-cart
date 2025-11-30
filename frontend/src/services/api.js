import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8081';
const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:8082';
const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8084';

// Create default axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Create service-specific axios instances
const productApi = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cartApi = axios.create({
  baseURL: CART_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const orderApi = axios.create({
  baseURL: ORDER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor to all service APIs
[productApi, cartApi, orderApi].forEach(instance => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
});

export default api;
export { productApi, cartApi, orderApi };
