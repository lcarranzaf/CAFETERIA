import React, { useState } from 'react';
import { crearRecompensa } from '../../services/recompensasService';
import Navbar from '../Navbar';

const CrearRecompensa = () => {
  const [form, setForm] = useState({ nombre: '', descripcion: '', estrellas_requeridas: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('authTokens'))?.access;
      await crearRecompensa(form, token);
      setMensaje('✅ Recompensa creada exitosamente');
      setForm({ nombre: '', descripcion: '', estrellas_requeridas: '' });
    } catch (err) {
      setMensaje('❌ Error al crear la recompensa');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Crear nueva recompensa 🎁
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la recompensa
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Bebida gratis"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej: Canjea una bebida gratis con esta recompensa"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="estrellas_requeridas" className="block text-sm font-medium text-gray-700 mb-1">
                Estrellas requeridas
              </label>
              <input
                name="estrellas_requeridas"
                type="number"
                min="1"
                value={form.estrellas_requeridas}
                onChange={handleChange}
                placeholder="Ej: 30"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300"
            >
              Crear Recompensa
            </button>

            {mensaje && (
              <p
                className={`text-center font-medium ${
                  mensaje.includes('✅') ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {mensaje}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearRecompensa;
