import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
      });
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
      return Promise.reject({
        status: null,
        message: 'No response received from server',
      });
    } else {
      console.error('API Error:', error.message);
      return Promise.reject({
        status: null,
        message: error.message,
      });
    }
  }
);

// Service definitions
const UserService = {
  createUser: (userData) => api.post('/users', userData),
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, updates) => api.put(`/users/${userId}`, updates),
};

const BikeService = {
  getAllBikes: () => api.get('/bikes'),
  getBikeById: (id) => api.get(`/bikes/${id}`),
  createBike: (bikeData) => api.post('/bikes', bikeData),
};

const PaymentService = {
  createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data),
  handlePaymentSuccess: (data) => api.post('/payment/handle-payment-success', data),
};
// services/api.js
export const community = {
  createPost: (postData) => api.post('/community/posts', postData),
  getPosts: () => api.get('/community'),
  likePost: (postId, userId) => api.post(`/community/${postId}/like`, { userId }),
  addComment: (postId, commentData) => api.post(`/community/${postId}/comments`, commentData)
};
// In services/api.js

// Add to exports
// Export named exports
export const bikes = BikeService;
export const payment = PaymentService;
export const users = UserService;

// Or default export if preferred
export default {
  bikes: BikeService,
  payment: PaymentService,
  users: UserService,
  community,
  tours: {
    getAllTours: () => axios.get('/api/tours'),
    createTour: (data) => axios.post('/api/tours', data),
    updateTour: (id, data) => axios.put(`/api/tours/${id}`, data),
    deleteTour: (id) => axios.delete(`/api/tours/${id}`)
  }  
};