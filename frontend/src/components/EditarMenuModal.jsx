import Modal from "./Modal";
import React, { useEffect, useState } from "react";

const EditarMenuModal = ({ form, onChange, onClose, onSubmit, error, onDelete }) => {
  const [preview, setPreview] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    if (!form) return;

    if (form.imagen instanceof File) {
      setPreview(URL.createObjectURL(form.imagen));
    } else if (typeof form.imagen === "string" && form.imagen !== "") {
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

  const handleConfirmarEliminar = () => {
    onDelete(form.id);
    setMostrarConfirmacion(false);
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} size="lg">
        <h2 className="text-xl font-bold mb-4">Editar Menú</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
              className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
              placeholder="Nombre"
            />
            {error?.nombre && (
              <p className="text-red-600 text-sm mt-1">{error.nombre}</p>
            )}
          </div>

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

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={onChange}
            required
            min="0"
            step="1"
            className="w-full border border-gray-900 px-4 py-2 rounded text-black bg-gray-100"
            placeholder="Stock disponible"
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

        {/* ✅ Botón de eliminar menú (debajo del formulario) */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMostrarConfirmacion(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          >
            🗑 Eliminar menú
          </button>
        </div>
      </Modal>

      {/* ✅ Modal de confirmación */}
      {mostrarConfirmacion && (
        <Modal isOpen={true} onClose={() => setMostrarConfirmacion(false)}>
          <h2 className="text-lg font-semibold mb-4 text-center">¿Estás seguro?</h2>
          <p className="mb-6 text-gray-800 text-center">
            Esta acción eliminará el menú permanentemente.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMostrarConfirmacion(false)}
              className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarEliminar}
              className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            >
              Aceptar y continuar
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditarMenuModal;
