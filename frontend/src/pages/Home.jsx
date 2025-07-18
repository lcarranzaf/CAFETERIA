import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
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

  const seleccionarMenusPorTipo = (lista) => {
    const tiposCantidad = {
      desayuno: 2,
      almuerzo: 2,
      piqueo: 2,
      bebida: 2,
    };

    const resultado = [];

    for (const tipo in tiposCantidad) {
      // Filtrar por tipo y que estén disponibles
      const filtrados = lista
        .filter((item) => item.tipo === tipo && item.disponible)
        // Ordenar por promedio de estrellas (de mayor a menor)
        .sort((a, b) => (b.estrellas || 0) - (a.estrellas || 0));

      // Agregar solo los top N (según cantidad)
      resultado.push(...filtrados.slice(0, tiposCantidad[tipo]));
    }

    return resultado;
  };
  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />
      <HeroSection />

      {/* MENÚ DESTACADO */}
      <section className="bg-gray-100 px-6 md:px-16 pt-2 pb-10 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Menú Destacado</h2>
        <MenuCarousel items={menus} />
      </section>

    </div>
  );
};

export default Home;
