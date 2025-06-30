import Modal from "./Modal";
import React, { useEffect, useState } from "react";

const EditarMenuModal = ({ form, onChange, onClose, onSubmit }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!form) return;

    if (form.imagen instanceof File) {
      // Si es un archivo subido nuevo
      setPreview(URL.createObjectURL(form.imagen));
    } else if (typeof form.imagen === "string" && form.imagen !== "") {
      // Si es una URL del backend
      setPreview(form.imagen);
    } else {
      setPreview(null);
    }
  }, [form.imagen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange({
        target: {
          name: "imagen",
          type: "file",
          files: [file],
        },
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    onChange({
      target: {
        name: "imagen",
        type: "file",
        files: [],
      },
    });
    setPreview(null);
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <h2 className="text-xl font-bold mb-4">Editar Menú</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          required
          className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
          placeholder="Nombre"
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          required
          className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
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
          className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
          placeholder="Precio"
        />
        <select
          name="tipo"
          value={form.tipo}
          onChange={onChange}
          className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
        >
          <option value="desayuno">Desayuno</option>
          <option value="almuerzo">Almuerzo</option>
          <option value="piqueo">Piqueo</option>
          <option value="bebida">Bebida</option>
        </select>

        {!preview && (
          <input
            type="file"
            name="imagen"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
        )}

        {preview && (
          <div className="relative mt-2">
            <img
              src={preview}
              alt="Vista previa"
              className="w-full h-40 object-contain rounded border border-gray-900"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 font-bold text-black">
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
