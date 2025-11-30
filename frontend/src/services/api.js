import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8081';
const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:8082';
const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

// Create axios instances with base URLs
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

// Add response interceptor for error handling
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request);
    throw new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    console.error('Error:', error.message);
    throw error;
  }
};

productApi.interceptors.response.use(
  (response) => response,
  handleError
);

cartApi.interceptors.response.use(
  (response) => response,
  handleError
);

orderApi.interceptors.response.use(
  (response) => response,
  handleError
);

export { productApi, cartApi, orderApi };
