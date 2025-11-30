import api from './api';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8084/api/users';

export const userService = {
  signup: async (userData) => {
    const response = await api.post(`${USER_SERVICE_URL}/signup`, userData);
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post(`${USER_SERVICE_URL}/login`, { username, password });
    return response.data;
  },

  forgotPassword: async (username) => {
    const response = await api.post(`${USER_SERVICE_URL}/forgot-password`, { username });
    return response.data;
  },

  changePassword: async (username, tempPassword, newPassword) => {
    const response = await api.post(`${USER_SERVICE_URL}/change-password`, {
      username,
      tempPassword,
      newPassword
    });
    return response.data;
  },

  getUser: async () => {
    const response = await api.get(`${USER_SERVICE_URL}/me`);
    return response.data;
  }
};

export default userService;
