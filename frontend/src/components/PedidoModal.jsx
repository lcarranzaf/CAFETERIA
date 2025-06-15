import React, { useContext, useState } from 'react';
import Modal from './Modal';
import { OrderContext } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PedidoModal = ({ isOpen, onClose }) => {
  const { pedido, eliminarDelPedido, confirmarPedido, actualizarCantidadPedido } = useContext(OrderContext);
  const [orderId, setOrderId] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  const total = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);

  const handleConfirmarPedido = async () => {
    try {
      const pedidoCreado = await confirmarPedido();
      setOrderId(pedidoCreado.id);
      setMensajeConfirmacion(true);
    } catch (error) {
      alert("❌ Error al confirmar el pedido");
    }
  };

  const handleActualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelPedido(id);
    } else {
      actualizarCantidadPedido(id, nuevaCantidad);
    }
  };

  const handleSubirComprobante = async () => {
    if (!comprobante || !orderId || !metodoPagoSeleccionado) {
      alert("❌ Debes seleccionar método de pago.");
      return;
    }

    const formData = new FormData();
    formData.append("comprobante_pago", comprobante);
    formData.append("metodo_pago", metodoPagoSeleccionado); // 🔥 IMPORTANTE

    try {
      await api.patch(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Comprobante subido correctamente.");
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert("❌ Error al subir comprobante.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">🛒 Tu Pedido</h2>

      {pedido.length === 0 && !mensajeConfirmacion ? (
        <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          {pedido.length > 0 && (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {pedido.map((item) => (
                <div key={item.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold capitalize">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">Precio por unidad: ${item.precio}</p>
                    <p className="text-sm text-gray-600">Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                        className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        −
                      </button>
                      <span className="px-2">{item.cantidad}</span>
                      <button
                        onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                        className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarDelPedido(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            {pedido.length > 0 && !mensajeConfirmacion && (
              <>
                <p className="font-medium mb-2">Total a pagar: ${total}</p>
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                  onClick={handleConfirmarPedido}
                >
                  Confirmar pedido
                </button>
              </>
            )}

            {mensajeConfirmacion && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium mb-1">Selecciona método de pago:</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className={`px-4 py-2 rounded ${metodoPagoSeleccionado === 'DEUNA' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setMetodoPagoSeleccionado('DEUNA')}
                    >
                      DEUNA
                    </button>
                  </div>
                </div>

                {metodoPagoSeleccionado === 'DEUNA' && (
                  <div className="text-sm text-blue-600 mb-4">
                    <p className="mb-2">
                      💳 Link de pago:{' '}
                      <a
                        href="https://pagar.deuna.app/H92p/..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Ir a DEUNA
                      </a>
                    </p>
                    <img src="/qrDeuna.jpeg" alt="QR Deuna" className="w-32 h-32 mx-auto" />
                  </div>
                )}

                <div>
                  <p className="font-medium mb-2">Sube el comprobante:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setComprobante(e.target.files[0])}
                    className="mb-2"
                  />
                  <button
                    onClick={handleSubirComprobante}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Subir comprobante
                  </button>
                </div>

                <p className="text-green-600 font-semibold">✅ Pedido confirmado correctamente.</p>
                <p>
                  Revisa tus{' '}
                  <Link to="/reservas" className="text-indigo-600 underline" onClick={onClose}>
                    reservas
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default PedidoModal;
