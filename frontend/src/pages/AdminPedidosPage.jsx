// src/pages/AdminPedidosPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { HiOutlineCalendar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const AdminPedidosPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [estadoReserva, setEstadoReserva] = useState('');
  const [estadoPago, setEstadoPago] = useState('');
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [actualizados, setActualizados] = useState({});
  const dateRef = useRef(null);

  useEffect(() => {
    api.get('orders/')
      .then(res => setOrdenes(res.data))
      .catch(err => console.error('Error al cargar órdenes:', err));
  }, []);

  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return f.toLocaleString();
  };

  const handleEstadoChange = (id, field, value) => {
    setActualizados(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const guardarCambios = async (id) => {
    if (!actualizados[id]) return;
    try {
      await api.patch(`orders/${id}/`, actualizados[id]);
      alert('✅ Cambios guardados');
      window.location.reload();
    } catch (error) {
      alert('❌ Error al guardar cambios');
    }
  };

  const ordenesFiltradas = ordenes.filter((o) => {
    const fechaOk = fechaSeleccionada
      ? new Date(o.fecha_orden).toLocaleDateString('en-CA') === fechaSeleccionada
      : true;

    const reservaOk = estadoReserva ? o.estado_reserva === estadoReserva : true;
    const pagoOk = estadoPago ? o.estado_pago === estadoPago : true;
    const usuarioOk = usuarioFiltro
      ? `${o.usuario?.first_name} ${o.usuario?.last_name}`.toLowerCase().includes(usuarioFiltro.toLowerCase())
      : true;

    return fechaOk && reservaOk && pagoOk && usuarioOk;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className='bg-amber-50 max-w-6xl mx-auto px-6 py-10'>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">📋 Ver Pedidos</h2>
            <Link to="/admin-panel" className=" inline-block text-center px-4 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded">
              ← Volver al panel
            </Link>
          </div>

          {/* Filtros superiores */}
          <div className="mb-6 grid md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Filtrar por fecha</label>
              <div className="relative w-full">
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  ref={dateRef}
                  className="w-full border rounded px-3 py-2 bg-white text-black pr-10"
                />
                <HiOutlineCalendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.focus()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Buscar por usuario</label>
              <input
                type="text"
                placeholder="Escriba el nombre"
                value={usuarioFiltro}
                onChange={(e) => setUsuarioFiltro(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
            </div>
          </div>

          {/* Filtros adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Filtrar por estado de reserva</label>
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
              <label className="block text-sm font-medium text-black mb-1">Filtrar por estado de pago</label>
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
          </div>
          <div className="mb-6">
            <button
              onClick={() => {
                setFechaSeleccionada('');
                setEstadoReserva('');
                setEstadoPago('');
                setUsuarioFiltro('');
              }}
              className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
            >
              Eliminar filtros
            </button>
          </div>
        </div>
        
        

        <p className="text-sm text-gray-600 mb-4">
          <strong>{ordenesFiltradas.length}</strong> pedido(s)
        </p>

        {ordenesFiltradas.length === 0 ? (
          <p className="text-gray-500">No se encontraron pedidos.</p>
        ) : (
          ordenesFiltradas.map((orden) => (
            <div key={orden.id} className={`p-4 rounded-xl shadow mb-6 ${orden.estado_reserva=== 'entregado' && orden.estado_pago === 'verificado'?'bg-green-100': 'bg-white'}`}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">
                  Usuario: {orden.usuario?.first_name} {orden.usuario?.last_name}
                </p>
                <p className="text-sm text-gray-600">Fecha: {formatearFecha(orden.fecha_orden)}</p>
              </div>

              <p>Total: ${Number(orden.total || 0).toFixed(2)}</p>
              {orden.estado_reserva === 'entregado' && orden.estado_pago === 'verificado' && (
                <div className="flex items-center gap-2 mt-2 text-green-700">
                  <HiCheckCircle className="text-xl" />
                  <span className="font-medium">Pedido completado</span>
                </div>
              )}
              <p className="text-sm text-gray-600">Reserva: {orden.estado_reserva}</p>
              <p className="text-sm text-gray-600">Pago: {orden.estado_pago}</p>

              <ul className="mt-2 text-sm text-gray-700">
                {orden.items?.map((item, i) => (
                  <li key={i}>🍽️ {item.menu_nombre} x {item.cantidad} - ${item.subtotal}</li>
                ))}
              </ul>

              {orden.comprobante_pago && (
                <img src={orden.comprobante_pago} alt="Comprobante" className="w-40 mt-2 rounded border" />
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  onChange={(e) => handleEstadoChange(orden.id, 'estado_reserva', e.target.value)}
                  className="border rounded px-3 py-1 bg-amber-50"
                  defaultValue={orden.estado_reserva}
                  disabled={orden.estado_reserva === 'entregado'}
                >
                  <option value="pendiente">Reserva Pendiente</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="entregado">Entregado</option>
                </select>

                <select
                  onChange={(e) => handleEstadoChange(orden.id, 'estado_pago', e.target.value)}
                  className="border rounded px-3 py-1 bg-amber-50"
                  defaultValue={orden.estado_pago}
                  disabled={orden.estado_pago === 'verificado'}
                >
                  <option value="pendiente">Pago Pendiente</option>
                  <option value="verificado">Verificado</option>
                  <option value="rechazado">Rechazado</option>
                </select>

                {!(orden.estado_reserva === 'entregado' && orden.estado_pago === 'verificado') && (
                  <button
                    onClick={() => guardarCambios(orden.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Guardar cambios
                  </button>
                )}
              </div>
            </div>
            //
          ))
        )}
      </section>
    </div>
  );
};

export default AdminPedidosPage;
