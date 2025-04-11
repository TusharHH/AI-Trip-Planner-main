import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
      return Promise.reject({
        status: null,
        message: 'No response received from server',
      });
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
      return Promise.reject({
        status: null,
        message: error.message,
      });
    }
  }
);

// Bike API methods
const BikeService = {
  getAllBikes: () => api.get('/bikes'),
  getBikeById: (id) => api.get(`/bikes/${id}`),
  createBike: (bikeData) => api.post('/bikes', bikeData),
  // Add more methods as needed
};

// Export all API services
export default {
  bikes: BikeService,
  // You can add other services here (e.g., users, bookings, etc.)
};