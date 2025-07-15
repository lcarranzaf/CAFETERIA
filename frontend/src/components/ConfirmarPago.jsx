import React, { useState, useEffect } from "react";
import api from "../services/api";

const ConfirmarPago = ({ orderId, onConfirmado }) => {
  const [metodoPago, setMetodoPago] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [subiendo, setSubiendo] = useState(false);


  useEffect(() => {
    if (!comprobante) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(comprobante);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [comprobante]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setComprobante(file);
    } else {
      alert("Por favor selecciona una imagen válida.");
      setComprobante(null);
    }
  };

  const eliminarComprobante = () => {
    setComprobante(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodoPago || !comprobante) {
      alert("Selecciona un método de pago y sube el comprobante");
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("metodo_pago", metodoPago);
      formData.append("comprobante_pago", comprobante);

      await api.post(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Comprobante enviado correctamente");
      onConfirmado();
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert("❌ Error al subir comprobante");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Confirmar pago</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Método de pago */}
        <div>
          <label className="block mb-1 font-medium">Método de pago:</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Selecciona uno</option>
            <option value="DEUNA">Deuna</option>
            <option value="PEIGO">Peigo</option>
          </select>
        </div>

        {/* Comprobante */}
        <div>
          <label className="block mb-1 font-medium">Comprobante de pago:</label>

          {!previewUrl && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          )}

          {previewUrl && (
            <div className="relative mt-2">
              <img
                src={previewUrl}
                alt="Vista previa del comprobante"
                className="w-full max-h-64 object-contain rounded border border-gray-400"
              />
              <button
                type="button"
                onClick={eliminarComprobante}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={subiendo}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          {subiendo ? "Enviando..." : "Enviar comprobante"}
        </button>
      </form>
    </div>
  );
};

export default ConfirmarPago;
