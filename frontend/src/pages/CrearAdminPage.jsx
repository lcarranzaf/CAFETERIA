import React, { useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { HiArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CrearAdminPage = () => {
  const [form, setForm] = useState({
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    is_staff: false
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [usernameDisponible, setUsernameDisponible] = useState(null);

  // ✅ Verificar si el username está disponible
  const verificarUsername = async (username) => {
    try {
      const res = await api.get(`/auth/verificar-username/?username=${username}`);
      setUsernameDisponible(res.data.disponible);
    } catch (err) {
      setUsernameDisponible(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'username') {
      if (value.trim().length > 2) {
        verificarUsername(value);
      } else {
        setUsernameDisponible(null);
      }
    }
  };

  const handleCheckbox = () => {
    setForm({ ...form, is_staff: !form.is_staff });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (usernameDisponible === false) {
      setError('❌ El nombre de usuario ya está en uso');
      return;
    }

    try {
      await api.post('auth/register/', {
        username: form.username,
        email: form.email,
        first_name: form.nombre,
        last_name: form.apellido,
        telefono: form.telefono,
        password: form.password,
        is_staff: form.is_staff,
      });

      setMensaje('✅ Usuario creado exitosamente');
      setForm({
        username: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        is_staff: false
      });
      setUsernameDisponible(null);
    } catch (err) {
      console.error(err);
      setError('❌ Error al crear el usuario');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 text-black">
        <Navbar />
        <section className="max-w-xl mx-auto py-12 px-6">
          <div className="bg-white shadow-xl rounded-xl p-8 border-t-8 border-indigo-500">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
              Crear Nuevo Usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border  rounded-lg focus:outline-none focus:ring-2 ${
                    usernameDisponible === false
                      ? 'border-red-500 focus:ring-red-300 bg-red-50'
                      : 'border-gray-900 focus:ring-indigo-400 bg-indigo-50'
                  }`}
                  required
                />
                {usernameDisponible === false && (
                  <p className="text-sm text-red-600 mt-1">❌ El nombre de usuario ya está en uso</p>
                )}
                {usernameDisponible === true && (
                  <p className="text-sm text-green-600 mt-1">✅ Nombre de usuario disponible</p>
                )}
              </div>

              {/* Nombre */}
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-900 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Apellido */}
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-900 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Correo */}
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-900 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Contraseña */}
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-900 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Teléfono */}
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-900 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {/* Checkbox */}
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_staff}
                  onChange={handleCheckbox}
                  className="accent-indigo-600 h-5 w-5"
                />
                <span>Registrar como administrador</span>
              </label>

              {/* Botón principal */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Registrar Usuario
              </button>

              {/* Botón volver */}
              <Link
                to="/admin-panel"
                className="w-full inline-block border border-gray-900 text-center mt-2 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg font-medium transition"
              >
                <HiArrowLeft className="inline mr-1" /> Volver al panel
              </Link>
            </form>

            {/* Mensajes */}
            {mensaje && <p className="mt-6 text-green-600 font-medium">{mensaje}</p>}
            {error && <p className="mt-6 text-red-600 font-medium">{error}</p>}
          </div>
        </section>
      </div>
    );

};

export default CrearAdminPage;
