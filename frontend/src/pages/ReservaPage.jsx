"use client"

import { useEffect, useState, useRef } from "react"
import Navbar from "../components/layout/Navbar"
import api from "../services/api"
import { HiOutlineCalendar } from "react-icons/hi"
import ImagenQR from "../components/ImagenQQR"
import Toast from "../components/Toast" 

const ReservaPage = () => {
  const [ordenes, setOrdenes] = useState([])
  const [estadoReserva, setEstadoReserva] = useState(localStorage.getItem("estadoReserva") || "")
  const [estadoPago, setEstadoPago] = useState(localStorage.getItem("estadoPago") || "")
  const [fechaDesde, setFechaDesde] = useState(localStorage.getItem("fechaDesde") || "")
  const [fechaHasta, setFechaHasta] = useState(localStorage.getItem("fechaHasta") || "")
  const [comprobantes, setComprobantes] = useState({})
  const [isLoading, setIsLoading] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const dateDesdeRef = useRef(null)
  const dateHastaRef = useRef(null)
  const [previewUrls, setPreviewUrls] = useState({})

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")

  useEffect(() => {
    api
      .get("orders/")
      .then((res) => setOrdenes(res.data))
      .catch((err) => console.error("Error al cargar órdenes:", err))
  }, [])

  useEffect(() => {
    localStorage.setItem("estadoReserva", estadoReserva)
    localStorage.setItem("estadoPago", estadoPago)
    localStorage.setItem("fechaDesde", fechaDesde)
    localStorage.setItem("fechaHasta", fechaHasta)
  }, [estadoReserva, estadoPago, fechaDesde, fechaHasta])

  const limpiarFiltros = () => {
    setEstadoReserva("")
    setEstadoPago("")
    setFechaDesde("")
    setFechaHasta("")
    localStorage.removeItem("estadoReserva")
    localStorage.removeItem("estadoPago")
    localStorage.removeItem("fechaDesde")
    localStorage.removeItem("fechaHasta")
  }

  const handleMetodoChange = (e, id) => {
    setOrdenes((prev) => prev.map((orden) => (orden.id === id ? { ...orden, metodo_pago: e.target.value } : orden)))
  }

  // ✅ ACTUALIZACIÓN CON TOAST EN VEZ DE ALERT
  const handleComprobanteUpload = async (orden) => {
    const file = comprobantes[orden.id]
    if (!file || !orden.metodo_pago) {
      setToastMessage("Selecciona método de pago y archivo")
      setToastType("warning")
      setToastVisible(true)
      return
    }

    const formData = new FormData()
    formData.append("metodo_pago", orden.metodo_pago)
    formData.append("comprobante_pago", file)

    setIsLoading((prev) => ({ ...prev, [orden.id]: true }))

    try {
      await api.patch(`orders/${orden.id}/upload_comprobante/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setToastMessage("✅ Comprobante subido con éxito")
      setToastType("success")
      setToastVisible(true)
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      setToastMessage("❌ Error al subir comprobante")
      setToastType("error")
      setToastVisible(true)
    } finally {
      setIsLoading((prev) => ({ ...prev, [orden.id]: false }))
    }
  }

  const formatearFecha = (fecha) => {
    const f = new Date(fecha)
    return f.toLocaleString()
  }

  const getEstadoColor = (estado, tipo) => {
    const colores = {
      reserva: {
        pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
        aceptado: "bg-green-100 text-green-800 border-green-200",
        rechazado: "bg-red-100 text-red-800 border-red-200",
        entregado: "bg-blue-100 text-blue-800 border-blue-200",
      },
      pago: {
        pendiente: "bg-orange-100 text-orange-800 border-orange-200",
        verificado: "bg-emerald-100 text-emerald-800 border-emerald-200",
        rechazado: "bg-red-100 text-red-800 border-red-200",
      },
    }
    return colores[tipo]?.[estado] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const ordenesFiltradas = ordenes
    .filter((orden) => {
      const coincideEstadoReserva = estadoReserva ? orden.estado_reserva === estadoReserva : true
      const coincideEstadoPago = estadoPago ? orden.estado_pago === estadoPago : true
      const fechaOrden = new Date(orden.fecha_orden).toLocaleDateString("en-CA")
      const coincideFechaDesde = fechaDesde ? fechaOrden >= fechaDesde : true
      const coincideFechaHasta = fechaHasta ? fechaOrden <= fechaHasta : true
      return coincideEstadoReserva && coincideEstadoPago && coincideFechaDesde && coincideFechaHasta
    })
    .sort((a, b) => new Date(b.fecha_orden) - new Date(a.fecha_orden))

  const contarFiltrosActivos = () => {
    let count = 0
    if (estadoReserva) count++
    if (estadoPago) count++
    if (fechaDesde) count++
    if (fechaHasta) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex pt-4">
        {/* Sidebar de Filtros */}
        <div
          className={`${sidebarCollapsed ? "w-16" : "w-80"} transition-all duration-300 bg-white shadow-xl border-r border-slate-200 min-h-[calc(100vh-80px)] sticky top-20`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Filtros</h3>
                  {contarFiltrosActivos() > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {contarFiltrosActivos()}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarCollapsed ? <span className="text-lg">🔍</span> : <span className="text-lg">✖️</span>}
              </button>
            </div>

            {!sidebarCollapsed && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">📦</span>
                    Estado de Reserva
                  </label>
                  <select
                    value={estadoReserva}
                    onChange={(e) => setEstadoReserva(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aceptado">Aceptado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">💳</span>
                    Estado de Pago
                  </label>
                  <select
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="verificado">Verificado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3  items-center gap-2">
                    <span className="text-lg">📅</span>
                    Rango de Fechas
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Desde</label>
                      <div className="relative">
                        <input
                          ref={dateDesdeRef}
                          type="date"
                          value={fechaDesde}
                          onChange={(e) => setFechaDesde(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                        />
                        <HiOutlineCalendar
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors"
                          onClick={() => {
                            if (dateDesdeRef.current?.showPicker) {
                              dateDesdeRef.current.showPicker()
                            } else {
                              dateDesdeRef.current.focus()
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Hasta</label>
                      <div className="relative">
                        <input
                          ref={dateHastaRef}
                          type="date"
                          value={fechaHasta}
                          onChange={(e) => setFechaHasta(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                        />
                        <HiOutlineCalendar
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors"
                          onClick={() => {
                            if (dateHastaRef.current?.showPicker) {
                              dateHastaRef.current.showPicker()
                            } else {
                              dateHastaRef.current.focus()
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={limpiarFiltros}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Limpiar filtros
                </button>

                {/* Resumen de resultados */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">{ordenesFiltradas.length}</p>
                    <p className="text-sm text-slate-600">pedidos encontrados</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-3xl">🧾</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Tus Pedidos</h2>
            </div>
            
          </div>
          {ordenesFiltradas.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-6 bg-slate-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
              <p className="text-slate-500 text-xl">No se encontraron pedidos</p>
              <p className="text-slate-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-6">
              {ordenesFiltradas.map((orden) => (
                <div
                  key={orden.id}
                  className="bg-white border border-slate-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <span className="text-xl">📅</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Pedido #{orden.id}</p>
                        <p className="text-sm text-slate-600">{formatearFecha(orden.fecha_orden)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">${Number(orden.total).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                        orden.estado_reserva,
                        "reserva",
                      )}`}
                    >
                      Reserva: {orden.estado_reserva}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                        orden.estado_pago,
                        "pago",
                      )}`}
                    >
                      Pago: {orden.estado_pago}
                    </span>
                  </div>
                  {orden.items && orden.items.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <span>🍽️</span>
                        Productos del pedido
                      </h4>
                      <ul className="space-y-2">
                        {orden.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-slate-700">
                              {item.menu_nombre} x {item.cantidad}
                            </span>
                            <span className="font-semibold text-slate-800">${Number(item.subtotal).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {orden.estado_pago === "pendiente" && !orden.comprobante_pago && (
                    <div className="space-y-4 mt-6 pt-4 border-t border-slate-200">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">💳</span>
                          <h3 className="font-semibold text-slate-800">Método de pago</h3>
                        </div>
                        <select
                          value={orden.metodo_pago || ""}
                          onChange={(e) => handleMetodoChange(e, orden.id)}
                          className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="">Selecciona método</option>
                          <option value="DEUNA">DEUNA</option>
                        </select>
                      </div>
                      {orden.metodo_pago === "DEUNA" && (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="text-center space-y-3">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-lg">📱</span>
                                <h4 className="font-semibold text-blue-800">Pago con DEUNA</h4>
                              </div>
                              <a
                                href="https://pagar.deuna.app/H92p/..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                              >
                                <span>🔗</span>
                                Ir a DEUNA
                              </a>
                              <div className="bg-white p-3 rounded-lg border border-blue-200 inline-block">
                                <ImagenQR className="transition-transform duration-300 ease-in-out hover:scale-110" />
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">📄</span>
                              <h3 className="font-semibold text-slate-800">Comprobante de pago</h3>
                            </div>
                            <div className="space-y-3">
                              <label className="block">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    setComprobantes((prev) => ({ ...prev, [orden.id]: file }))
                                    setPreviewUrls((prev) => ({ ...prev, [orden.id]: URL.createObjectURL(file) }))
                                  }}
                                  className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-slate-400 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                />
                              </label>
                              {comprobantes[orden.id] && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <span>📎</span>
                                  <span>{comprobantes[orden.id]?.name}</span>
                                </div>
                              )}
                              {previewUrls[orden.id] && (
                                <div className="mt-2">
                                  <img
                                    src={previewUrls[orden.id]}
                                    alt="Vista previa del comprobante"
                                    className="w-48 rounded-lg border border-slate-300 shadow-md"
                                  />
                                </div>
                              )}
                              {comprobantes[orden.id] && (
                                <button
                                  onClick={() => handleComprobanteUpload(orden)}
                                  disabled={isLoading[orden.id]}
                                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {isLoading[orden.id] ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Subiendo...
                                    </>
                                  ) : (
                                    <>
                                      <span>📤</span>
                                      Subir comprobante
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {orden.comprobante_pago && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-green-800 font-semibold">Comprobante subido correctamente</p>
                      </div>
                      <img
                        src={orden.comprobante_pago}
                        alt="Comprobante subido"
                        className="w-48 rounded-lg border border-green-300 shadow-md"
                      />

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      
      <Toast message={toastMessage} show={toastVisible} type={toastType} />
    </div>
  )
}

export default ReservaPage
