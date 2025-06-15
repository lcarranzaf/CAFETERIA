// src/components/SuccessModal.jsx
import React, { useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SuccessModal = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 500); 

      return () => clearTimeout(timer); 
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-fade bg-white text-center max-w-sm mx-auto mt-40 p-6 rounded shadow-md border border-green-400"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
    >
      <h2 className="text-lg font-semibold text-green-600">
        {message || '✅ Acción realizada'}
      </h2>
    </Modal>
  );
};

export default SuccessModal;
