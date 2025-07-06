import React, { useEffect, useState } from 'react';
import { obtenerRecompensas, canjearRecompensa } from '../../services/recompensasService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const RecompensasList = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const { user, actualizarPerfil } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authTokens'))?.access; 
        const data = await obtenerRecompensas(token);
        setRecompensas(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleCanjear = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('authTokens'))?.access; 
      const res = await canjearRecompensa(id, token);
      setMensaje(res.detail || '✅ Recompensa canjeada');
      await actualizarPerfil();
    } catch (err) {
      const detalle = err.response?.data?.detail || '';
      setMensaje(
        detalle.includes("suficientes estrellas")
          ? "❌ No tienes suficientes estrellas para esta recompensa."
          : detalle || 'Error al canjear'
      );
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🎁 Recompensas Disponibles
          </h2>
          <div className="flex justify-center mb-6">
            <Link
              to="/historial-recompensas"
              className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-xl font-semibold transition duration-300"
            >
              📜 Ver historial de canjes
            </Link>
          </div>

          <div className="text-center text-lg font-medium text-gray-700 mb-4">
            ⭐ Estrellas actuales: <span className="text-yellow-500 font-bold ">{user?.estrellas}</span>
          </div>

          

          {mensaje && (
            <p
              className={`text-center mb-4 font-medium ${
                mensaje.includes('✅') || mensaje.includes('Has canjeado')
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {mensaje}
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {recompensas.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-indigo-700">{r.nombre}</h3>
                <p className="text-gray-600 mt-2">{r.descripcion}</p>
                <p className="mt-3 font-semibold text-sm text-gray-700">
                  ⭐ Requiere: <span className="text-yellow-500 font-bold">{r.estrellas_requeridas}</span> estrellas
                </p>
                <button
                  onClick={() => handleCanjear(r.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={user?.estrellas < r.estrellas_requeridas}
                >
                  Canjear
                </button>
              </div>
            ))}
          </div>

          {recompensas.length === 0 && (
            <p className="text-center mt-8 text-gray-500">No hay recompensas disponibles por ahora.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RecompensasList;
