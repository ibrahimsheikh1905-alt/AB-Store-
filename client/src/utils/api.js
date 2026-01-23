import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors silently - don't show error messages for auth failures
    if (error.response?.status === 401) {
      // Only clear token if it exists (user was logged in)
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        // Don't redirect automatically, let components handle it
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Coupons API
export const couponsAPI = {
  apply: (data) => api.post('/coupons/apply', data),
};

// Admin API
export const adminAPI = {
  getProducts: () => api.get('/admin/products'),
  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderPayment: (id) => api.put(`/admin/orders/${id}/pay`),
  updateOrderDelivery: (id) => api.put(`/admin/orders/${id}/deliver`),
  getCoupons: () => api.get('/coupons'),
  createCoupon: (couponData) => api.post('/coupons', couponData),
  updateCoupon: (id, couponData) => api.put(`/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getUserReviews: () => api.get('/reviews/user'),
  getAll: () => api.get('/reviews/admin'),
  check: (productId) => api.get(`/reviews/check/${productId}`),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
