// src/pages/CrearMenuPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/Toast';

const CrearMenuPage = () => {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'desayuno',
    imagen: null,
    disponible: true,
    stock: '',
  });

  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    console.log('🍞 Mostrando toast:', message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'imagen') {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (error[name]) {
      setError(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!user || !user.is_staff) {
      showToast('No tienes permisos para acceder aquí', 'error');
      return;
    }

    if (!form.imagen) {
      showToast('Debes seleccionar una imagen', 'error');
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      await api.post('menus/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('✅ Menú creado correctamente', 'success');
      navigate('/menu');
    } catch (err) {
      const data = err.response?.data;
      console.log('📦 Error recibido del servidor:', data);

      if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const message = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          setError({ [firstKey]: message }); // para que el mensaje se muestre debajo del input si aplica
          showToast(`❌ ${message}`, 'error'); // muestra el toast visible
        } else {
          showToast('❌ Error desconocido', 'error');
        }
      } else if (data?.detail) {
        showToast(`❌ ${data.detail}`, 'error');
      } else {
        showToast('❌ Error al crear el menú', 'error');
      }
    } finally {
      setSubiendo(false);
    }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-xl p-10 border-t-8 border-indigo-500">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">🍽️ Crear Nuevo Menú</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del menú"
                className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
                required
              />
              {error.nombre && (
                <p className="text-red-600 text-sm mt-1">{error.nombre}</p>
              )}
            </div>

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del menú"
              rows={3}
              className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
                required
              />

              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="piqueo">Piqueo</option>
                <option value="bebida">Bebida</option>
              </select>
            </div>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock disponible"
              min={0}
              className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:border file:border-indigo-300 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="disponible"
                checked={form.disponible}
                onChange={handleChange}
                className="accent-indigo-500 w-5 h-5"
              />
              <span className="text-sm text-gray-700">¿Disponible?</span>
            </label>

            <button
              type="submit"
              disabled={subiendo}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg transition"
            >
              {subiendo ? 'Subiendo...' : 'Crear Menú'}
            </button>
          </form>
        </div>
      </div>

      <Toast message={toast.message} show={toast.show} type={toast.type} />
    </div>
  );
};

export default CrearMenuPage;
