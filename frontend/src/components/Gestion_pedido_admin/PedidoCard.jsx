"use client"

import { useState } from "react"
import { HiCheckCircle } from "react-icons/hi"
import Toast from "../Toast"

const PedidoCard = ({
  orden,
  formatearFecha,
  getEstadoColor,
  recompensasPorUsuario,
  handleEstadoChange,
  guardarCambios,
  isLoading,
}) => {
  const [estadoReserva, setEstadoReserva] = useState(orden.estado_reserva)
  const [estadoPago, setEstadoPago] = useState(orden.estado_pago)

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  })

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  const isCompleted = estadoReserva === "entregado" && estadoPago === "verificado"

  const handleEstadoAutoSync = (estado, tipo) => {
    if (tipo === "estado_reserva" && estado === "rechazado" && estadoPago !== "rechazado") {
      setEstadoPago("rechazado")
      handleEstadoChange(orden.id, "estado_pago", "rechazado")
    }
    if (tipo === "estado_pago" && estado === "rechazado" && estadoReserva !== "rechazado") {
      setEstadoReserva("rechazado")
      handleEstadoChange(orden.id, "estado_reserva", "rechazado")
    }
  }

  const verificarStockInsuficiente = () => {
    return orden.items?.some((item) => item.cantidad > item.menu_stock)
  }

  return (
    <>
      <div
        className={`bg-white/90 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.01] ${
          isCompleted ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50" : "border-slate-200"
        }`}
      >
        <div
          className={`px-4 py-3 border-b ${
            isCompleted
              ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200"
              : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg shadow-md ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-200 to-emerald-200"
                    : "bg-gradient-to-br from-slate-200 to-slate-300"
                }`}
              >
                {isCompleted ? (
                  <HiCheckCircle className="text-lg text-green-600" />
                ) : (
                  <span className="text-lg">📦</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Pedido #{orden.id}</h3>
                <p className="text-sm text-slate-600 font-semibold">
                  {orden.usuario?.first_name} {orden.usuario?.last_name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600">${Number(orden.total || 0).toFixed(2)}</p>
              <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1">
                {formatearFecha(orden.fecha_orden)}
              </p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 mt-3 text-green-700 bg-green-100 px-3 py-2 rounded-lg border border-green-200">
              <HiCheckCircle className="text-lg" />
              <span className="font-bold text-sm">✨ Pedido completado exitosamente</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-2 rounded-full text-xs font-bold border ${getEstadoColor(estadoReserva, "reserva")}`}
            >
              🍽️ Reserva: {estadoReserva}
            </span>
            <span className={`px-3 py-2 rounded-full text-xs font-bold border ${getEstadoColor(estadoPago, "pago")}`}>
              💳 Pago: {estadoPago}
            </span>
          </div>

          {orden.items?.length > 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 mb-4 border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <span>🍽️</span>
                Productos del pedido
              </h4>
              <div className="space-y-2">
                {orden.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-200"
                  >
                    <div>
                      <span className="text-sm text-slate-700 font-semibold">
                        {item.menu_nombre} <span className="text-blue-600 font-bold">x {item.cantidad}</span>
                      </span>
                      <p className="text-xs text-gray-500">Stock actual: {item.menu_stock}</p>
                    </div>
                    <span className="font-bold text-emerald-600">${item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orden.comprobante_pago && (
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <span>📄</span>
                Comprobante de pago
              </h4>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <img
                  src={orden.comprobante_pago || "/placeholder.svg"}
                  alt="Comprobante"
                  className="w-48 h-auto rounded-lg border border-slate-300 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                  onClick={() => window.open(orden.comprobante_pago, "_blank")}
                />
              </div>
            </div>
          )}

          {recompensasPorUsuario[orden.usuario?.id]?.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="text-blue-800 font-bold mb-3 flex items-center gap-2 text-sm">
                <span>🎁</span>
                Recompensas Canjeadas por este Usuario
              </h4>
              <div className="space-y-2">
                {recompensasPorUsuario[orden.usuario.id].map((rec) => (
                  <div
                    key={rec.id}
                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-blue-200"
                  >
                    <span className="text-sm text-blue-800 font-bold">{rec.recompensa_nombre}</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md font-semibold">
                      {new Date(rec.fecha_canje).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Estado de Reserva</label>
              <select
                value={estadoReserva}
                onChange={(e) => {
                  const valor = e.target.value
                  if (valor === "aceptado" && verificarStockInsuficiente()) {
                    showToast("❌ No hay stock disponible para este pedido", "error")
                    setEstadoReserva("rechazado")
                    setEstadoPago("rechazado")
                    handleEstadoChange(orden.id, "estado_reserva", "rechazado")
                    handleEstadoChange(orden.id, "estado_pago", "rechazado")
                  } else {
                    setEstadoReserva(valor)
                    handleEstadoChange(orden.id, "estado_reserva", valor)
                    handleEstadoAutoSync(valor, "estado_reserva")
                  }
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                disabled={estadoReserva === "entregado"}
              >
                <option value="pendiente">Pendiente</option>
                <option value="aceptado">Aceptado</option>
                <option value="rechazado">Rechazado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Estado de Pago</label>
              <select
                value={estadoPago}
                onChange={(e) => {
                  const valor = e.target.value
                  setEstadoPago(valor)
                  handleEstadoChange(orden.id, "estado_pago", valor)
                  handleEstadoAutoSync(valor, "estado_pago")
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 transition-all duration-200 text-sm"
                disabled={estadoPago === "verificado"}
              >
                <option value="pendiente">Pendiente</option>
                <option value="verificado">Verificado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={async () => {
                  try {
                    await guardarCambios(orden.id, estadoReserva, estadoPago)
                    showToast("✅ Cambios guardados exitosamente", "success")
                  } catch (error) {
                    console.error("Error al guardar:", error)
                    showToast("❌ Ocurrió un error al guardar los cambios", "error")
                  }
                }}
                disabled={isLoading[orden.id]}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 text-sm"
              >
                {isLoading[orden.id] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
        </div>
      </div>

      <Toast message={toast.message} show={toast.show} type={toast.type} />
    </>
  )
}

export default PedidoCard
