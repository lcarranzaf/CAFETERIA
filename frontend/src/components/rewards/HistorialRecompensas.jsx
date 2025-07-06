import React, { useEffect, useState } from 'react';
import { obtenerHistorialCanjes } from '../../services/recompensasService';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import { useNavigate } from 'react-router-dom';

const HistorialRecompensas = () => {
  const { authTokens } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await obtenerHistorialCanjes(authTokens?.access);
        setHistorial(res);
      } catch (err) {
        setError('Error al obtener el historial');
      }
    };

    fetchHistorial();
  }, [authTokens]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            📜 Historial de Recompensas Canjeadas
          </h2>

          <div className="text-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              ← Regresar
            </button>
          </div>

          {error && (
            <p className="text-center text-red-500 font-medium mb-4">{error}</p>
          )}

          {historial.length === 0 ? (
            <p className="text-center text-gray-600">
              Aún no has canjeado ninguna recompensa.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {historial.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-indigo-700 capitalize">{item.recompensa_nombre}</h3>
                  <p className="text-gray-600 mt-1">{item.recompensa_descripcion}</p>
                  <p className="mt-3 text-sm text-gray-500">
                    Fecha: {new Date(item.fecha_canje).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorialRecompensas;
