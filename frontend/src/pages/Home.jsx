import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
import api from '../services/api';
import { Link } from 'react-router-dom';
const Home = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('menus/')
      .then((res) => setMenus(res.data))
      .catch((err) => {
        console.error("Error cargando menús:", err);
        setMenus([]);
      });
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10">
        <div className="text-center md:text-left max-w-xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Tu comida en el campus, <br className="hidden md:block" /> en un clic.
          </h1>
          <p className="text-gray-600">
            Menú digital, reservas anticipadas y recompensas en un solo lugar.
          </p>
          <br/>
          <Link
            to="/menu"
            className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
          >
            Empezar ahora
          </Link>
        </div>
        <div className="relative">
          <img src="/plato.png" alt="plato principal" className="w-72 md:w-96 rounded-xl" />
          <div className="absolute -bottom-4 -right-4 bg-white border-2 border-blue-300 rounded-xl p-3 shadow text-center">
            <span className="text-yellow-500 text-lg">⭐</span>
            <p className="text-sm font-medium">4.2</p>
            <p className="text-xs text-gray-500">Valoraciones</p>
          </div>
        </div>
      </section>

      {/* MENÚ */}
      <section className="bg-gray-100 px-6 md:px-16 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">Menú</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {menus.map((item) => (
            <MenuCard
              key={item.id}
              nombre={item.nombre}
              descripcion={item.descripcion}
              precio={item.precio}
              imagen={item.imagen || '/placeholder.png'}
              onAgregar={() => handleAgregar(item)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
