// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );

  // Cargar perfil extendido (rol, is_staff, etc.)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authTokens) {
        try {
          const res = await api.get('auth/profile/');
          setUser((prev) => ({ ...prev, ...res.data }));
        } catch (error) {
          console.error('❌ Error al cargar perfil:', error);
        }
      }
    };

    fetchUserProfile();
  }, [authTokens]);

  // 🕒 Refrescar token periódicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      if (authTokens) {
        const decoded = jwtDecode(authTokens.access);
        const now = Date.now() / 1000;

        // Si faltan menos de 60 segundos para que expire
        if (decoded.exp - now < 60) {
          try {
            const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
              refresh: authTokens.refresh,
            });

            const newTokens = {
              ...authTokens,
              access: res.data.access,
            };

            setAuthTokens(newTokens);
            localStorage.setItem('authTokens', JSON.stringify(newTokens));

            // También actualiza el usuario si quieres
            const refreshedUser = jwtDecode(res.data.access);
            setUser((prev) => ({ ...prev, ...refreshedUser }));
          } catch (error) {
            console.error('⚠️ Fallo al refrescar token automáticamente');
            logoutUser();
          }
        }
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [authTokens]);

  const loginUser = async (tokenData) => {
    setAuthTokens(tokenData);
    const decoded = jwtDecode(tokenData.access);
    setUser(decoded);
    localStorage.setItem('authTokens', JSON.stringify(tokenData));

    try {
      const res = await api.get('auth/profile/');
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error('❌ Error al cargar perfil al iniciar sesión:', error);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('pedido');
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
