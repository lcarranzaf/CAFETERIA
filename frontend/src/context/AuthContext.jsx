import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

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

  // Obtener perfil desde el backend (mezcla con los datos del JWT)
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

  // Login: guarda tokens y perfil
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
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
