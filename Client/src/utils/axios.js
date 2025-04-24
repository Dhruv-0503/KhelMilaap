import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // replace with your deployed URL in prod
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token to Authorization header if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
