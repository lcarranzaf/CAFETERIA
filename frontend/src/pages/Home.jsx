import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import MenuCarousel from '../components/MenuCarousel';


const Home = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('menus/')
      .then((res) => {
        const filtrados = seleccionarMenusPorTipo(res.data);
        setMenus(filtrados);
      })
      .catch((err) => {
        console.error("Error cargando menús:", err);
        setMenus([]);
      });
  }, []);

  // ✅ Función para limitar la cantidad por tipo
  const seleccionarMenusPorTipo = (lista) => {
    const tiposCantidad = {
      desayuno: 1,
      almuerzo: 2,
      piqueo: 1,
      bebida: 2,
    };

    const resultado = [];

    for (const tipo in tiposCantidad) {
      const filtrados = lista.filter((item) => item.tipo === tipo && item.disponible);
      resultado.push(...filtrados.slice(0, tiposCantidad[tipo]));
    }

    return resultado;
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />
      <HeroSection />

      {/* MENÚ DESTACADO */}
      <section className="bg-gray-100 px-6 md:px-16 pt-8 pb-10 mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">Menú Destacado</h2>
        <MenuCarousel items={menus} />
      </section>

    </div>
  );
};

export default Home;
