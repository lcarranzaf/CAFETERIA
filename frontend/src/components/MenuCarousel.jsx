import React, { useRef, useContext, useState } from 'react';
import MenuCard from './MenuCard';
import { OrderContext } from '../context/OrderContext';
import Toast from './Toast';
import MenuReviewForm from './MenuReviewForm';

const MenuCarousel = ({ items }) => {
  const scrollRef = useRef(null);
  const { agregarAlPedido } = useContext(OrderContext);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [carouselItems, setCarouselItems] = useState(items); // <- nuevo estado

  const scrollLeft = () => {
    const updatedItems = [...carouselItems];
    const last = updatedItems.pop();
    updatedItems.unshift(last);
    setCarouselItems(updatedItems);
  };

  const scrollRight = () => {
    const updatedItems = [...carouselItems];
    const first = updatedItems.shift();
    updatedItems.push(first);
    setCarouselItems(updatedItems);
  };

  const handleAgregar = (item) => {
    agregarAlPedido(item);
    setToastMessage(`${item.nombre} agregado al pedido`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <div className="relative w-full">
      {/* Botón Izquierdo */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 border rounded-full p-2 shadow z-10"
      >
        ◀
      </button>

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scrollbar-hide gap-6 px-12 py-2 scroll-smooth snap-x snap-mandatory justify-center"
      >
        {carouselItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] max-w-[250px] snap-start flex-shrink-0"
          >
            <div className="flex flex-col justify-between h-full bg-gray-100 rounded-xl p-4 text-center shadow-md">
              <MenuCard
                id={item.id}
                nombre={item.nombre}
                descripcion={item.descripcion}
                precio={item.precio}
                imagen={item.imagen || '/placeholder.png'}
                onAgregar={() => handleAgregar(item)}
                promedio={item.promedio_calificacion}
                cantidad={item.cantidad_reviews}
                extraContent={<MenuReviewForm menuId={item.id} />}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botón Derecho */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 border rounded-full p-2 shadow z-10"
      >
        ▶
      </button>

      <Toast message={toastMessage} show={toastVisible} type="success" />
    </div>
  );
};

export default MenuCarousel;
