"use client"

import { HiCheckCircle } from "react-icons/hi"

const PedidoCard = ({
  orden,
  formatearFecha,
  getEstadoColor,
  recompensasPorUsuario,
  handleEstadoChange,
  guardarCambios,
  isLoading,
}) => {
  const isCompleted = orden.estado_reserva === "entregado" && orden.estado_pago === "verificado"

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-[1.01] ${
        isCompleted ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50" : "border-slate-200"
      }`}
    >
      {/* Header del pedido */}
      <div
        className={`px-6 py-4 border-b-2 ${
          isCompleted
            ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200"
            : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div
              className={`p-3 rounded-xl shadow-lg ${
                isCompleted
                  ? "bg-gradient-to-br from-green-200 to-emerald-200"
                  : "bg-gradient-to-br from-slate-200 to-slate-300"
              }`}
            >
              {isCompleted ? (
                <HiCheckCircle className="text-2xl text-green-600" />
              ) : (
                <span className="text-xl">📦</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Pedido #{orden.id}</h3>
              <p className="text-slate-600 font-semibold">
                {orden.usuario?.first_name} {orden.usuario?.last_name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">${Number(orden.total || 0).toFixed(2)}</p>
            <p className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg mt-1">
              {formatearFecha(orden.fecha_orden)}
            </p>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-3 mt-4 text-green-700 bg-green-100 px-4 py-3 rounded-xl border border-green-200">
            <HiCheckCircle className="text-xl" />
            <span className="font-bold">✨ Pedido completado exitosamente</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Estados */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span
            className={`px-5 py-3 rounded-full text-sm font-bold border-2 shadow-md ${getEstadoColor(
              orden.estado_reserva,
              "reserva",
            )}`}
          >
            🍽️ Reserva: {orden.estado_reserva}
          </span>
          <span
            className={`px-5 py-3 rounded-full text-sm font-bold border-2 shadow-md ${getEstadoColor(
              orden.estado_pago,
              "pago",
            )}`}
          >
            💳 Pago: {orden.estado_pago}
          </span>
        </div>

        {/* Items del pedido */}
        {orden.items?.length > 0 && (
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-6 border-2 border-slate-200">
            <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-3 text-lg">
              <span>🍽️</span>
              Productos del pedido
            </h4>
            <div className="space-y-3">
              {orden.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200"
                >
                  <span className="text-slate-700 font-semibold">
                    {item.menu_nombre} <span className="text-blue-600 font-bold">x {item.cantidad}</span>
                  </span>
                  <span className="font-bold text-emerald-600 text-lg">${item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comprobante */}
        {orden.comprobante_pago && (
          <div className="mb-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-3 text-lg">
              <span>📄</span>
              Comprobante de pago
            </h4>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <img
                src={orden.comprobante_pago || "/placeholder.svg"}
                alt="Comprobante"
                className="w-72 h-auto rounded-xl border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => window.open(orden.comprobante_pago, "_blank")}
              />
            </div>
          </div>
        )}

        {/* Recompensas */}
        {recompensasPorUsuario[orden.usuario?.id]?.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <h4 className="text-blue-800 font-bold mb-5 flex items-center gap-3 text-lg">
              <span>🎁</span>
              Recompensas Canjeadas por este Usuario
            </h4>
            <div className="space-y-3">
              {recompensasPorUsuario[orden.usuario.id].map((rec) => (
                <div
                  key={rec.id}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-blue-200"
                >
                  <span className="text-blue-800 font-bold">{rec.recompensa_nombre}</span>
                  <span className="text-blue-600 text-sm bg-blue-100 px-3 py-2 rounded-lg font-semibold">
                    {new Date(rec.fecha_canje).toLocaleDateString("es-ES")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controles de estado */}
        {!isCompleted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Estado de Reserva</label>
              <select
                onChange={(e) => handleEstadoChange(orden.id, "estado_reserva", e.target.value)}
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                defaultValue={orden.estado_reserva}
                disabled={orden.estado_reserva === "entregado"}
              >
                <option value="pendiente">Pendiente</option>
                <option value="aceptado">Aceptado</option>
                <option value="rechazado">Rechazado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Estado de Pago</label>
              <select
                onChange={(e) => handleEstadoChange(orden.id, "estado_pago", e.target.value)}
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 transition-all duration-200"
                defaultValue={orden.estado_pago}
                disabled={orden.estado_pago === "verificado"}
              >
                <option value="pendiente">Pendiente</option>
                <option value="verificado">Verificado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => guardarCambios(orden.id)}
                disabled={isLoading[orden.id]}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105"
              >
                {isLoading[orden.id] ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PedidoCard
