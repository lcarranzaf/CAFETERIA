import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { OrderContext } from '../context/OrderContext';
import api from '../services/api'; // <-- Asegúrate de tener esto

const PedidoPage = () => {
  const { pedido, eliminarDelPedido, confirmarPedido } = useContext(OrderContext);
  const [orderId, setOrderId] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  const total = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);

  const handleConfirmarPedido = async () => {
    try {
      const pedidoCreado = await confirmarPedido(); // guarda el pedido en backend
      setOrderId(pedidoCreado.id);
      setMensajeConfirmacion(true);
    } catch (error) {
      alert("❌ Error al confirmar el pedido");
    }
  };

  const handleSubirComprobante = async () => {
    if (!comprobante || !orderId) {
      alert("❌ Debes seleccionar una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("comprobante_pago", comprobante);

    try {
      await api.patch(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Comprobante subido correctamente.");
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert("❌ Error al subir comprobante.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <section className="py-10 px-4 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Tu Pedido</h2>

        {pedido.length === 0 && !mensajeConfirmacion ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            {pedido.length > 0 && (
              <div className="grid gap-6">
                {pedido.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold capitalize">{item.nombre}</h3>
                      <p className="text-sm text-gray-600">Descripción: {item.descripcion}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                      <p className="text-sm text-gray-600">Valor por unidad: ${item.precio}</p>
                      <p className="text-sm text-gray-600">
                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarDelPedido(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              {pedido.length > 0 && !mensajeConfirmacion && (
                <>
                  <p className="text-xl font-semibold mb-4">Total a pagar: ${total}</p>
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
                    onClick={handleConfirmarPedido}
                  >
                    Confirmar pedido
                  </button>
                </>
              )}

              {mensajeConfirmacion && (
                <div className="mt-6 text-center">
                  

                  <div className="mb-4">
                    <p className="font-medium mb-2">Selecciona un método de pago para ver detalles:</p>
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
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ir a DEUNA
                        </a>
                      </p>
                      <img src="/qrDeuna.jpeg" alt="QR Deuna" className="w-32 h-32 mx-auto mb-4" />
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="font-medium mb-2">Sube el comprobante de pago:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setComprobante(e.target.files[0])}
                      className="mb-2"
                    />
                    <br></br>
                    <button
                      onClick={handleSubirComprobante}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Subir comprobante
                    </button>
                    <p className="text-green-600 font-semibold mb-2">
                    ✅ Pedido confirmado correctamente.
                  </p>
                  <p className="mb-4">
                    Dirígete a{' '}
                    <Link to="/reservas" className="text-indigo-600 underline">
                      Reservas
                    </Link>{' '}
                    para subir tu comprobante y seleccionar método de pago si aun no lo ha realizado.
                  </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PedidoPage;
