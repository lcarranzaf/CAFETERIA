import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
import MenuReviewForm from '../components/MenuReviewForm'; 
import api from '../services/api';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const tipos = ['desayuno', 'almuerzo', 'piqueo', 'bebida'];

const MenuPage = () => {
  const { agregarAlPedido } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const [menus, setMenus] = useState([]);
  const [tipoActivo, setTipoActivo] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.get('menus/')
      .then((res) => {
        const hoy = new Date().toISOString().split('T')[0];

        let visibles;
        if (user?.rol === 'admin') {
          visibles = res.data;
        } else {
          visibles = res.data.filter((item) => item.disponible);
        }

        setMenus(visibles);
      })
      .catch((err) => {
        console.error("Error cargando menús:", err);
      });
  }, [user]);

  const handleAgregar = (item) => {
    if (user) {
      agregarAlPedido(item);
      setToastMessage(`${item.nombre} agregado al pedido`);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } else {
      alert('Debes iniciar sesión para agregar al pedido');
    }
  };

  const menusFiltrados = tipoActivo
    ? menus.filter((item) => item.tipo === tipoActivo)
    : menus;

  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />
      <Toast message={toastMessage} show={toastVisible} type="success" />

      <section className="py-8 px-4 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Menú del día</h2>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              className={`capitalize px-6 py-2 rounded-full text-white font-medium transition ${
                tipoActivo === tipo ? 'bg-indigo-700' : 'bg-indigo-400 hover:bg-indigo-600'
              }`}
              onClick={() => setTipoActivo(tipo === tipoActivo ? null : tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>

        {/* Menús */}
        {menusFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {menusFiltrados.map((item) => (
              <div key={item.id} className="flex flex-col justify-between h-full bg-gray-100 rounded-xl p-4 text-center shadow-md">
                <MenuCard
                  id={item.id}
                  promedio={item.promedio_calificacion}
                  nombre={item.nombre}
                  precio={item.precio}
                  descripcion={item.descripcion}
                  imagen={item.imagen}
                  onAgregar={() => handleAgregar(item)}
                  extraContent={<MenuReviewForm menuId={item.id} nombreMenu={item.nombre}/>}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-gray-500 font-medium">
            🥲 Aún no se han agregado las{' '}
            {tipoActivo
              ? tipoActivo === 'almuerzo'
                ? 'opciones de almuerzo del día'
                : tipoActivo === 'bebida'
                ? 'bebidas del día'
                : tipoActivo === 'piqueo'
                ? 'piqueos del día'
                : 'opciones de desayuno del día'
              : 'opciones del día'}
          </p>
        )}
      </section>
    </div>
  );
};

export default MenuPage;
