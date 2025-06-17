// src/components/EditarMenuModal.jsx
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const EditarMenuModal = ({ form, onChange, onClose, onSubmit }) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Editar Menú"
      className="bg-white max-w-lg mx-auto mt-20 p-6 rounded shadow-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">Editar Menú</h2>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          required
          className="w-full border px-4 py-2 rounded text-black bg-gray-300"
          placeholder="Nombre"
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          required
          className="w-full border px-4 py-2 rounded text-black bg-gray-300"
          placeholder="Descripción"
        ></textarea>
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={onChange}
          required
          min="0.01"
          step="0.01"
          className="w-full border px-4 py-2 rounded text-black bg-gray-300"
          placeholder="Precio"
        />
        <select
          name="tipo"
          value={form.tipo}
          onChange={onChange}
          className="w-full border px-4 py-2 rounded text-black bg-gray-300"
        >
          <option value="desayuno">Desayuno</option>
          <option value="almuerzo">Almuerzo</option>
          <option value="piqueo">Piqueo</option>
          <option value="bebida">Bebida</option>
        </select>
        <input
          type="file"
          name="imagen"
          onChange={onChange}
          className="w-full"
          accept="image/*"
        />
        <div className="flex items-center gap-2 font-bold text-black ">
          <input
            type="checkbox"
            name="disponible"
            checked={form.disponible}
            onChange={onChange}
          />
          <label htmlFor="disponible">¿Disponible?</label>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarMenuModal;
