import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import { OrderContext } from '../context/OrderContext';
import ConfirmarPago from '../components/ConfirmarPago';

const PedidoPage = () => {
  const { pedido, eliminarDelPedido, confirmarPedido } = useContext(OrderContext);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const total = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <section className="py-10 px-4 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Tu Pedido</h2>

        {pedido.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
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

            <div className="mt-8 text-center">
              <p className="text-xl font-semibold mb-4">Total a pagar: ${total}</p>

              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={async () => {
                  const id = await confirmarPedido();
                  if (id) {
                    setOrderId(id);
                    setMostrarConfirmacion(true);
                  } else {
                    alert('Error al confirmar el pedido');
                  }
                }}
              >
                Confirmar pedido
              </button>

              {mostrarConfirmacion && orderId && (
                <ConfirmarPago
                  orderId={orderId}
                  onConfirmado={() => {
                    setMostrarConfirmacion(false);
                    setOrderId(null);
                  }}
                />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PedidoPage;
