// src/pages/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import cafeteriaImage from '../../assets/cafeteria.jpeg';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login/', credentials);
      loginUser(response.data);
      navigate('/'); // redirige luego
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Parte izquierda: formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="Correo"
                value={credentials.username}
                onChange={handleChange}
                className="pl-10 w-full py-2 border rounded shadow-sm"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
                className="pl-10 w-full py-2 border rounded shadow-sm"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              INGRESAR
            </button>
          </form>
          <p className="text-center text-sm mt-4 text-gray-600">¿Olvidó su contraseña?</p>
        </div>
      </div>

      {/* Parte derecha: imagen */}
      <div className="hidden md:block w-1/2">
        <img src={cafeteriaImage} alt="cafetería" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
