import React, { useState } from 'react';
import { crearRecompensa } from '../../services/recompensasService';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { HiArrowLeft } from 'react-icons/hi';

const CrearRecompensa = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    estrellas_requeridas: '',
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!form.nombre || !form.descripcion || !form.estrellas_requeridas) {
      setMensaje('❌ Por favor, completa todos los campos.');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('authTokens'))?.access;
      await crearRecompensa(form, token);
      setMensaje('✅ Recompensa creada exitosamente.');
      setForm({ nombre: '', descripcion: '', estrellas_requeridas: '' });
    } catch (err) {
      setMensaje('❌ Error al crear la recompensa.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          

          <h2 className="text-2xl mt-4 font-bold text-gray-800 mb-6 text-center">
            Crear nueva recompensa 🎁
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-1">
                Nombre de la recompensa
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Bebida gratis"
                className="w-full border bg-gray-50 border-gray-900 rounded-xl px-4 py-2 focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej: Canjea una bebida gratis con esta recompensa"
                className="w-full border bg-gray-50 border-gray-900 rounded-xl px-4 py-2 h-24 resize-none focus:outline-none text-black  focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="estrellas_requeridas" className="block text-sm font-bold text-gray-700 mb-1">
                Estrellas requeridas
              </label>
              <input
                name="estrellas_requeridas"
                type="number"
                min="1"
                value={form.estrellas_requeridas}
                onChange={handleChange}
                placeholder="Ej: 30"
                className="w-full border bg-gray-50 border-gray-900 rounded-xl px-4 py-2 focus:outline-none text-black  focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300"
            >
              Crear Recompensa
            </button>
            <div className="mb-4">
              <Link
                to="/gestionar-recompensas"
                className="w-full inline-block border border-gray-900 text-center mt-2 bg-gray-300 hover:bg-blue-400 text-black py-2 rounded-lg font-bold transition"
              >
                Volver al panel administrador
              </Link>
            </div>

            {mensaje && (
              <div
                className={`text-center text-sm font-medium rounded-xl py-2 px-4 mt-2 ${
                  mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {mensaje}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearRecompensa;
