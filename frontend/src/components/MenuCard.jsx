import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SuccessModal from './SuccessModal';

const MenuCard = ({ id, nombre, precio, descripcion, imagen, onAgregar }) => {
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const destacar = async () => {
    try {
      await api.post(`menus/${id}/set_destacado/`);
      alert('✅ Plato marcado como destacado');
    } catch (err) {
      alert('❌ Error al marcar como destacado');
      console.error(err);
    }
  };

  const handleAgregar = () => {
    if (onAgregar) {
      onAgregar();
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  return (
    <div className="bg-indigo-200 rounded-xl p-4 text-center shadow-md flex flex-col justify-between h-full">
      <img
        src={imagen || '/plato.png'}
        alt={nombre}
        className="w-full h-40 object-contain bg-white rounded-md mb-2"
        onError={(e) => (e.target.src = '/placeholder.png')}
      />
      <div className="text-yellow-500 mb-1">★★★★★</div>
      <h3 className="font-bold capitalize text-lg">{nombre}</h3>
      <h3 className="font-semibold text-sm capitalize mt-1 ">{descripcion}</h3>
      <p className="text-sm text-gray-800 mt-1 font-semibold">${Number(precio).toFixed(2)}</p>

      {/* Botón Agregar */}
      <button
        onClick={handleAgregar}
        disabled={!onAgregar}
        className={`mt-2 bg-white rounded-full p-1 px-3 text-xl ${
          onAgregar ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
      >
        ＋
      </button>

      {/* Botón Destacar solo visible si es admin */}
      {user?.is_staff && (
        <button
          onClick={destacar}
          className="mt-2 bg-yellow-500 text-white py-1 px-3 rounded-full text-sm hover:bg-yellow-600 transition"
        >
          ⭐ Destacar
        </button>
      )}

      
    </div>
  );
};

export default MenuCard;
