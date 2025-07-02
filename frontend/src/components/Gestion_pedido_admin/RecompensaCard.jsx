"use client"

import { useState } from "react"
import api from "../../services/api"
import Toast from "../Toast" // ajusta la ruta si es distinta

const RecompensaCard = ({ recompensa }) => {
  const [estado, setEstado] = useState(recompensa.estado_entrega || "pendiente")
  const [originalEstado, setOriginalEstado] = useState(recompensa.estado_entrega || "pendiente")
  const [loading, setLoading] = useState(false)

  // Estado para el toast
  const [toastMsg, setToastMsg] = useState("")
  const [toastType, setToastType] = useState("success")
  const [showToast, setShowToast] = useState(false)

  const mostrarToast = (mensaje, tipo = "success") => {
    setToastMsg(mensaje)
    setToastType(tipo)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleGuardarCambios = async () => {
    try {
      setLoading(true)
      await api.patch(`/recompensas-canjeadas/${recompensa.id}/`, {
        estado_entrega: estado,
      })
      setOriginalEstado(estado)
      mostrarToast("Estado actualizado correctamente", "success")
    } catch (error) {
      setEstado(originalEstado)
      mostrarToast("Error al actualizar el estado", "error")
    } finally {
      setLoading(false)
    }
  }

  const badgeColor =
    estado === "entregado"
      ? "bg-green-100 text-green-700 border-green-300"
      : "bg-yellow-100 text-yellow-800 border-yellow-300"

  const estadoCapitalizado =
    estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Pendiente"

  const estadoEditable = originalEstado !== "entregado"

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg">
            <span className="text-3xl">🏆</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-slate-800">{recompensa.usuario_nombre}</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${badgeColor}`}>
                Estado: {estadoCapitalizado}
              </span>
            </div>

            <p className="text-xl font-bold text-amber-700 mb-3">{recompensa.recompensa_nombre}</p>
            <p className="text-slate-600 mb-5 text-lg leading-relaxed">{recompensa.recompensa_descripcion}</p>

            <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 mb-4">
              <span className="text-lg">📅</span>
              <span className="font-semibold">
                Canjeado el{" "}
                {new Date(recompensa.fecha_canje).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {estadoEditable && (
              <div className="mt-3 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="text-sm font-bold text-slate-700">Cambiar estado:</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    disabled={loading}
                    className="w-48 border-2 border-amber-300 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none text-black focus:ring-2 focus:ring-amber-500 font-semibold transition-all duration-200"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                {estado !== originalEstado && (
                  <button
                    onClick={handleGuardarCambios}
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toastMsg} type={toastType} show={showToast} />
    </>
  )
}

export default RecompensaCard
