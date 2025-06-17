import React, { useRef, useContext, useState } from 'react';
import MenuCard from './MenuCard';
import { OrderContext } from '../context/OrderContext';
import Toast from './Toast';

const MenuCarousel = ({ items }) => {
  const scrollRef = useRef(null);
  const { agregarAlPedido } = useContext(OrderContext);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const handleAgregar = (item) => {
    agregarAlPedido(item);
    setToastMessage(` ${item.nombre} agregado al pedido`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow z-10"
      >
        ◀
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scrollbar-hide gap-6 px-4 py-2 scroll-smooth snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] max-w-[250px] snap-start flex-shrink-0"
          >
            <MenuCard
              nombre={item.nombre}
              descripcion={item.descripcion}
              precio={item.precio}
              imagen={item.imagen || '/placeholder.png'}
              onAgregar={() => handleAgregar(item)}
              
            />
            
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow z-10"
      >
        ▶
      </button>

      {/* Toast de confirmación */}
      <Toast message={toastMessage} show={toastVisible} type="success" />
    </div>
  );
};

export default MenuCarousel;
