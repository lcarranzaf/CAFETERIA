// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cafeteriaImage from '../../assets/CAFETERIA.WEBP';
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
    <div className="flex flex-col-reverse md:flex-row min-h-screen overflow-x-hidden">
      {/* Imagen */}
      <div className="w-full md:w-1/2 overflow-hidden">
        <img src={cafeteriaImage} alt="cafetería" className="w-full h-auto object-cover md:h-screen" />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4 md:p-6">
        <div className="bg-amber-50 shadow-lg rounded-lg p-8 w-full max-w-md mx-2 md:mx-0">
          <h2 className="text-2xl text-black font-bold text-center mb-6">Registrarse</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="first_name" placeholder="Nombres" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm text-gray-500" />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="last_name" placeholder="Apellidos" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm text-gray-500" />
            </div>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm text-gray-500" />
            </div>
            <div className="relative">
              <FaAt className="absolute left-3 top-3 text-gray-500" />
              <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white text-gray-500 shadow-sm" />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm text-gray-500" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="pl-10 w-full py-2 border rounded bg-white shadow-sm text-gray-500" />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              REGISTRAR
            </button>
            <br></br>
            <span className="text-black   py-2 rounded mt-4 inline-block text-sm ">
              ¿Ya tienes una cuenta?
              <Link
              to="/login"
              className="text-blue-500 hover:underline font-medium p-2 "
            >Inicia Sesión aquí..
            </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
