import axios from 'axios';
const API_URL = 'http://localhost:4000/api';
const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use(config => {
  const JWTtoken = localStorage.getItem('JWTtoken');
  if (JWTtoken && !config.url.includes('/auth')) {
    config.headers.Authorization = `Bearer ${JWTtoken}`;
  }
  return config;
});
export default api;