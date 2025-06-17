import React, { useState } from 'react';
import Modal from './Modal'; // Ajusta la ruta si es necesario

const ImagenQR = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src="/qrDeuna.jpeg"
        alt="QR Deuna"
        className="w-32 h-32 mx-auto mb-4 transition-transform duration-300 hover:scale-110 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <img
          src="/qrDeuna.jpeg"
          alt="QR Deuna Ampliado"
          className="w-full h-auto max-h-[80vh] object-contain rounded"
        />
      </Modal>
    </>
  );
};

export default ImagenQR;
