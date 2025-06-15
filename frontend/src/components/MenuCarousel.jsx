// src/components/MenuCarousel.jsx
import React, { useRef } from 'react';
import MenuCard from './MenuCard';

const MenuCarousel = ({ items }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
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
              onAgregar={() => {}}
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
    </div>
  );
};

export default MenuCarousel;
