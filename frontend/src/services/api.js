import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor REQUEST
api.interceptors.request.use(
  async (config) => {
    let tokens = JSON.parse(localStorage.getItem('authTokens'));

    if (tokens && tokens.access) {
      const decoded = jwtDecode(tokens.access);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
            refresh: tokens.refresh,
          });

          tokens.access = res.data.access;
          localStorage.setItem('authTokens', JSON.stringify(tokens));
        } catch (err) {
          console.error('❌ No se pudo refrescar el token (request). Cerrando sesión.');
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor RESPONSE
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = JSON.parse(localStorage.getItem('authTokens'));

      if (!tokens?.refresh) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
          refresh: tokens.refresh,
        });

        tokens.access = res.data.access;
        localStorage.setItem('authTokens', JSON.stringify(tokens));

        originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
        return api(originalRequest); // Reintenta con nuevo token
      } catch (err) {
        console.error('❌ No se pudo refrescar el token (response). Cerrando sesión.');
        localStorage.removeItem('authTokens');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
