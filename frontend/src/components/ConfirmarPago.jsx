// src/components/ConfirmarPago.jsx
import React, { useState } from 'react';
import api from '../services/api';

const ConfirmarPago = ({ orderId, onConfirmado }) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodoPago || !comprobante) {
      alert('Selecciona un método de pago y sube el comprobante');
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append('metodo_pago', metodoPago);
      formData.append('comprobante_pago', comprobante);

      await api.post(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('✅ Comprobante enviado correctamente');
      onConfirmado();  // Cierra el componente modal o realiza otras acciones
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      alert('❌ Ocurrió un error al subir el comprobante');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Confirmar pago</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block mb-1 font-medium">Comprobante de pago:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setComprobante(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={subiendo}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          {subiendo ? 'Enviando...' : 'Enviar comprobante'}
        </button>
      </form>
    </div>
  );
};

export default ConfirmarPago;
