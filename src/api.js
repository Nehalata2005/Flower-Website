import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apifinal.technorapide.in/api/auth', // proxied to backend in dev via Vite
  headers: { 'Content-Type': 'application/json' }
});

// attach token automatically if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
