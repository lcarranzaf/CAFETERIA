// src/components/HeroSection.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const HeroSection = () => {
  const { user } = useContext(AuthContext);
  const { agregarAlPedido } = useContext(OrderContext);
  const [destacado, setDestacado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // ✅ estado del modal

  useEffect(() => {
    api.get('menus/')
      .then((res) => {
        const found = res.data.find((item) => item.destacado === true);
        setDestacado(found);
      })
      .catch((err) => {
        console.error("Error cargando menú destacado:", err);
      });
  }, []);

  const handleAgregar = () => {
    if (destacado && agregarAlPedido) {
      agregarAlPedido(destacado);
      setModalVisible(true); // ✅ mostrar modal
      setTimeout(() => setModalVisible(false), 2000); // ✅ ocultar tras 2 seg
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 gap-10">
      {/* LADO IZQUIERDO */}
      <div className="text-center md:text-left max-w-xl space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Tu comida en el campus, <br className="hidden md:block" /> en un clic.
        </h1>
        <p className="text-gray-600">
          Menú digital, reservas anticipadas y recompensas en un solo lugar.
        </p>
        <br />
        <Link
          to="/menu"
          className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
        >
          Empezar ahora
        </Link>
      </div>

      {/* LADO DERECHO */}
      <div className="relative text-center">
        <img
          src={destacado?.imagen || "/plato.png"}
          alt={destacado?.nombre || "plato principal"}
          className="w-72 md:w-96 rounded-xl mx-auto"
        />

        {/* Valoración flotante solo en desktop */}
        <div className="hidden md:block absolute -bottom-4 -right-4 bg-white border-2 border-blue-300 rounded-xl p-3 shadow text-center">
          <span className="text-yellow-500 text-lg">⭐</span>
          <p className="text-sm font-medium">4.2</p>
          <p className="text-xs text-gray-500">Valoraciones</p>
        </div>

        {/* Contenido debajo en móvil */}
        {destacado && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{destacado.nombre}</h2>
            <p className="text-indigo-600 font-bold">${destacado.precio}</p>

            <div className="block md:hidden mt-2 text-xs text-gray-600">
              <span className="text-yellow-500 text-base">⭐</span> 4.2 Valoraciones
            </div>

            {user && (
              <button
                onClick={handleAgregar}
                className="mt-3 inline-block bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              >
                Agregar al pedido
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ Modal de éxito */}
      <SuccessModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        message="✅ Agregado al pedido"
      />
    </section>
  );
};

export default HeroSection;
