import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from './Modal';
import { MdRateReview } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';

const MenuReviewForm = ({ menuId }) => {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [yaComentado, setYaComentado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reseñas, setReseñas] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('calificar');

  useEffect(() => {
    api.get('/reviews/')
      .then(res => {
        const lista = res.data.filter(r => Number(r.menu) === Number(menuId));
        setReseñas(lista);

        const existe = lista.find(r => r.es_del_usuario);
        if (existe) {
          setYaComentado(true);
          setComentario(existe.comentario);
          setCalificacion(existe.calificacion);
        }
      })
      .catch(err => console.error('Error al cargar reseñas:', err));
  }, [menuId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews/', { menu: menuId, comentario, calificacion });
      setYaComentado(true);
      setMensaje('✅ Comentario guardado');
      setModalOpen(false);
    } catch (error) {
      setMensaje('❌ Ya comentaste o hubo un error');
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => {
          setModalOpen(true);
          setVistaActiva('calificar');
        }}
        className="bg-gray-100 text-sm text-indigo-700 underline hover:text-indigo-900"
      >
        <MdRateReview className="inline-block mr-1 " />
        Ver / Calificar este menú
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md mx-auto text-sm">

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setVistaActiva('calificar')}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition ${
                vistaActiva === 'calificar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <MdRateReview />
              Calificar menú
            </button>
            <button
              onClick={() => setVistaActiva('ver')}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition ${
                vistaActiva === 'ver'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <FaRegEye />
              Ver reseñas
            </button>
          </div>

          {/* Vista calificar */}
          {vistaActiva === 'calificar' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              {!yaComentado ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">⭐ Calificación</label>
                    <select
                      value={calificacion}
                      onChange={(e) => setCalificacion(parseInt(e.target.value))}
                      className="w-full border rounded px-2 py-2 bg-gray-100"
                      required
                    >
                      {[5, 4, 3, 2, 1].map(val => (
                        <option key={val} value={val}>
                          {val} estrella{val > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">💬 Comentario</label>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={3}
                      className="w-full border rounded px-2 py-2 bg-gray-100"
                      placeholder="¿Qué te pareció?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Enviar reseña
                  </button>
                  {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
                </form>
              ) : (
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <p><strong>⭐ Tu calificación:</strong> {calificacion}</p>
                  <p><strong>💬 Tu comentario:</strong> {comentario}</p>
                </div>
              )}
            </div>
          )}

          {/* Vista ver reseñas */}
          {vistaActiva === 'ver' && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-md mb-3">🗣️ Reseñas de otros usuarios</h4>
              {reseñas.length === 0 ? (
                <p className="text-gray-500">Aún no hay comentarios.</p>
              ) : (
                <ul className="space-y-2 pr-1">
                  {reseñas.map((r, idx) => (
                    <li key={idx} className="border rounded px-3 py-2 bg-white shadow-sm">
                      <p className="text-yellow-600 font-medium mb-1">
                        ⭐ {r.calificacion} - {r.usuario_nombre || 'Anónimo'}
                      </p>
                      <p className="text-gray-800">{r.comentario}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MenuReviewForm;
