// src/pages/ReservaPage.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ReservaPage = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    api.get('orders/')
      .then((res) => setOrdenes(res.data))
      .catch((err) => console.error('Error al cargar órdenes:', err));
  }, []);

  const handleMetodoChange = (e, id) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id ? { ...orden, metodo_pago: e.target.value } : orden
      )
    );
  };

  const handleComprobanteUpload = async (e, orden) => {
    const file = e.target.files[0];
    if (!file || !orden.metodo_pago) return alert('Selecciona método de pago y archivo');

    const formData = new FormData();
    formData.append('metodo_pago', orden.metodo_pago);
    formData.append('comprobante_pago', file);

    try {
      await api.post(`orders/${orden.id}/upload_comprobante/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Comprobante subido con éxito');
      window.location.reload();
    } catch (error) {
      alert('❌ Error al subir comprobante');
    }
  };

  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return f.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <section className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="pedido">🧾</span> Tus Pedidos
        </h2>

        {ordenes.length === 0 ? (
          <p className="text-center text-gray-500">No tienes pedidos registrados.</p>
        ) : (
          ordenes.map((orden) => (
            <div
              className="bg-white shadow-md rounded-xl p-4 mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">{formatearFecha(orden.fecha_orden)}</p>
              </div>
              <p>Estado reserva: {orden.estado_reserva}</p>
              <p>Estado pago: {orden.estado_pago}</p>
              <p>Total: ${Number(orden.total).toFixed(2)}</p>

              {orden.items && orden.items.length > 0 && (
                <ul className="mt-4 border-t pt-2">
                  {orden.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      🍽️ {item.menu_nombre} x {item.cantidad} — ${Number(item.subtotal).toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}

              {orden.estado_pago === 'pendiente' && !orden.comprobante_pago && (
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium">
                    Método de pago:
                    <select
                      value={orden.metodo_pago || ''}
                      onChange={(e) => handleMetodoChange(e, orden.id)}
                      className="ml-2 px-2 py-1 rounded border"
                    >
                      <option value="">Selecciona</option>
                      <option value="DEUNA">DEUNA</option>
                    </select>
                  </label>

                  {orden.metodo_pago === 'DEUNA' && (
                    <div className="text-sm text-blue-600">
                      <p>💳 Link de pago: <a href="https://pagar.deuna.app/H92p/U2FsdGVkX1+tdNs4fsxy0svJbnoWdkBCiEWTItsUGiQ2YONon4Mr2ZZTC8+HhQeoEheflH0csD0AKEf6atC65hAQnvFSaRbjeZvhN3RnsPIjASvHf+HdF7Puzh7eWa0jlGamww/RX7e0X+GLXlZX6WO/Z/jdnuycroo+S6OYhyzz4OwTBYUXTnE27Qw3I8/WEeH6+4pRQC/orj/ifKCFlA==" className="underline">Ir a DEUNA</a></p>
                      <img
                        src="/qrDeuna.jpeg"
                        alt="QR Peigo"
                        className="w-32 h-32 mt-2"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleComprobanteUpload(e, orden)}
                    className="w-full"
                  />
                </div>
              )}

              {orden.comprobante_pago && (
                <p className="mt-4 text-green-600 font-medium">✅ Comprobante subido</p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ReservaPage;
