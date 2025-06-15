// src/pages/CrearMenuPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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
      alert('Debes seleccionar una imagen antes de enviar.');
      setSubiendo(false);
      return;
    }
    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('precio', form.precio);
      formData.append('tipo', form.tipo);
      formData.append('imagen', form.imagen);
      formData.append('disponible', true);

      await api.post('menus/', formData, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Menú creado correctamente');
      navigate('/menu');
    } catch (err) {
      console.error('Error creando menú:', err);
      alert('❌ Error al crear el menú');
      if (err.response?.data) {
        console.error('Detalle del error:', err.response.data);
      }
      alert('❌ Error al crear el menú');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <section className="py-10 px-4 md:px-20 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Agregar Nuevo Menú</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del menú"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          ></textarea>
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="piqueo">Piqueo</option>
            <option value="bebida">Bebida</option>
          </select>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
            />
            <label htmlFor="disponible">¿Está disponible?</label>
          </div>
          <button
            type="submit"
            disabled={subiendo}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {subiendo ? 'Subiendo...' : 'Crear Menú'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CrearMenuPage;
