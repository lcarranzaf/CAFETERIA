// src/components/MenuCard.jsx
import React from 'react';

const MenuCard = ({ nombre, precio, descripcion, imagen, onAgregar }) => {
  return (
    <div className="bg-indigo-200 rounded-xl p-4 text-center shadow-md flex flex-col justify-between h-full">
      <img
        src={imagen || '/plato.png'}
        alt={nombre}
        className="w-full h-32 object-cover rounded-md mb-2"
        onError={(e) => (e.target.src = '/placeholder.png')}
      />
      <div className="text-yellow-500 mb-1">★★★★★</div>
      <h3 className="font-bold capitalize text-lg">{nombre}</h3>
      <p className="text-sm text-gray-700 mt-1">{precio}</p> 
      <p className="text-sm text-gray-800 mt-1 font-semibold">${Number(precio).toFixed(2)}</p>
      <button
        onClick={onAgregar}
        
        disabled={!onAgregar}
        className={`mt-2 bg-white rounded-full p-1 px-3 text-xl ${
            onAgregar
            ? 'hover:bg-gray-100 cursor-pointer'
            : 'cursor-not-allowed opacity-50'
        }`}
      >＋
      </button>
    </div>
  );
};

export default MenuCard;
