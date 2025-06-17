import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { HiOutlineCalendar } from 'react-icons/hi';
import ImagenQR from '../components/ImagenQQR'
const ReservaPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [estadoReserva, setEstadoReserva] = useState(localStorage.getItem('estadoReserva') || '');
  const [estadoPago, setEstadoPago] = useState(localStorage.getItem('estadoPago') || '');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(localStorage.getItem('fechaSeleccionada') || '');
  const [comprobantes, setComprobantes] = useState({});
  const dateRef = useRef(null);

  useEffect(() => {
    api.get('orders/')
      .then((res) => setOrdenes(res.data))
      .catch((err) => console.error('Error al cargar órdenes:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('estadoReserva', estadoReserva);
    localStorage.setItem('estadoPago', estadoPago);
    localStorage.setItem('fechaSeleccionada', fechaSeleccionada);
  }, [estadoReserva, estadoPago, fechaSeleccionada]);

  const limpiarFiltros = () => {
    setEstadoReserva('');
    setEstadoPago('');
    setFechaSeleccionada('');
    localStorage.removeItem('estadoReserva');
    localStorage.removeItem('estadoPago');
    localStorage.removeItem('fechaSeleccionada');
  };

  const handleMetodoChange = (e, id) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id ? { ...orden, metodo_pago: e.target.value } : orden
      )
    );
  };

  const handleComprobanteUpload = async (orden) => {
    const file = comprobantes[orden.id];
    if (!file || !orden.metodo_pago) return alert('Selecciona método de pago y archivo');

    const formData = new FormData();
    formData.append('metodo_pago', orden.metodo_pago);
    formData.append('comprobante_pago', file);

    try {
      await api.patch(`orders/${orden.id}/upload_comprobante/`, formData, {
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

  const ordenesFiltradas = ordenes
    .filter((orden) => {
      const coincideEstadoReserva = estadoReserva ? orden.estado_reserva === estadoReserva : true;
      const coincideEstadoPago = estadoPago ? orden.estado_pago === estadoPago : true;
      const coincideFecha = fechaSeleccionada
        ? new Date(orden.fecha_orden).toLocaleDateString('en-CA') === fechaSeleccionada
        : true;

      return coincideEstadoReserva && coincideEstadoPago && coincideFecha;
    })
    .sort((a, b) => new Date(b.fecha_orden) - new Date(a.fecha_orden));

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="pedido">🧾</span> Tus Pedidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Estado de Reserva</label>
            <select
              value={estadoReserva}
              onChange={(e) => setEstadoReserva(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado de Pago</label>
            <select
              value={estadoPago}
              onChange={(e) => setEstadoPago(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="verificado">Verificado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Fecha exacta</label>
            <div className="relative">
              <input
                ref={dateRef}
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white text-black pr-10"
              />
              <HiOutlineCalendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => {
                  if (dateRef.current?.showPicker) {
                    dateRef.current.showPicker();
                  } else {
                    dateRef.current.focus();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full bg-red-50 text-red-700 px-3 py-2 rounded hover:bg-red-300"
            >
              Eliminar filtros
            </button>
          </div>
        </div>

        {ordenesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron pedidos.</p>
        ) : (
          ordenesFiltradas.map((orden) => (
            <div key={orden.id} className="bg-amber-50 shadow-md rounded-xl p-4 mb-6 ">
              <div className="flex items-center gap-2 mb-2">
                <span className="...">Fecha:</span>
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
                      className="ml-2 px-2 py-1 rounded border bg-amber-100"
                    >
                      <option value="">Selecciona</option>
                      <option value="DEUNA">DEUNA</option>
                    </select>
                  </label>

                  {orden.metodo_pago === 'DEUNA' && (
                    <div className="text-sm text-blue-600">
                      <p>💳 Link de pago: <a href="https://pagar.deuna.app/H92p/..." className="underline">Ir a DEUNA</a></p>
                      <ImagenQR />
                    </div>
                  )}

                  <label className="inline-block bg-amber-50 border border-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-amber-100 transition">
                    Seleccionar archivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setComprobantes(prev => ({
                        ...prev,
                        [orden.id]: e.target.files[0]
                      }))}
                      className="hidden"
                    />
                  </label>
                  <span className="ml-2 text-sm text-gray-600">
                    {comprobantes[orden.id]?.name || 'Sin archivos seleccionados'}
                  </span>
                  <br></br>
                  {comprobantes[orden.id] && (
                    <button
                      onClick={() => handleComprobanteUpload(orden)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Subir comprobante
                    </button>
                  )}
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
