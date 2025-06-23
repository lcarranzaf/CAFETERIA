// src/pages/CrearMenuPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaPlusCircle, FaUtensils, FaDollarSign, FaList, FaImage, FaCheck } from 'react-icons/fa';

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
  });

  const [subiendo, setSubiendo] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'imagen') {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.is_staff) {
      alert('No tienes permisos para acceder aquí');
      return;
    }

    if (!form.imagen) {
      alert('Debes seleccionar una imagen');
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

      alert('✅ Menú creado correctamente');
      navigate('/menu');
    } catch (err) {
      console.error('❌ Error al crear el menú:', err);
      if (err.response?.data) console.error(err.response.data);
      alert('❌ Error al crear el menú');
    } finally {
      setSubiendo(false);
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
    <Navbar />
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 border-t-8 border-indigo-500">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">🍽️ Crear Nuevo Menú</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del menú"
            className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Descripción */}
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del menú"
            rows={3}
            className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Precio y tipo */}
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

          {/* Imagen */}
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:border file:border-indigo-300 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />

          {/* Checkbox */}
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

          {/* Botón */}
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
  </div>
);

};

export default CrearMenuPage;
