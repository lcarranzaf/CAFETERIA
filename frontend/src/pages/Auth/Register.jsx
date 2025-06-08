// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cafeteriaImage from '../../assets/cafeteria.jpeg';
import api from '../../services/api';
import { FaUser, FaLock, FaAt, FaPhone } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/', form);
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Verifique los datos.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Imagen */}
      <div className="hidden md:flex w-full md:w-1/2">
        <img src={cafeteriaImage} alt="cafetería" className="w-full h-full object-cover" />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="first_name" placeholder="Nombres" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="last_name" placeholder="Apellidos" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>
            <div className="relative">
              <FaAt className="absolute left-3 top-3 text-gray-500" />
              <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm" />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              REGISTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
