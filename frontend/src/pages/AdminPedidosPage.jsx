"use client"

import { useEffect, useState, useRef } from "react"
import api from "../services/api"
import Navbar from "../components/Navbar"
import { HiOutlineCalendar, HiCheckCircle, HiArrowLeft, HiEye, HiGift } from "react-icons/hi"
import { Link } from "react-router-dom"
import { obtenerRecompensasPorUsuario, obtenerHistorialTodos } from "../services/recompensasService"
import { useAuth } from "../context/AuthContext"

const AdminPedidosPage = () => {
  const [ordenes, setOrdenes] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState("")
  const [estadoReserva, setEstadoReserva] = useState("")
  const [estadoPago, setEstadoPago] = useState("")
  const [usuarioFiltro, setUsuarioFiltro] = useState("")
  const [ordenamiento, setOrdenamiento] = useState("fecha_desc") // Nuevo para ordenar pedidos
  const [actualizados, setActualizados] = useState({})
  const [recompensasPorUsuario, setRecompensasPorUsuario] = useState({})
  const [recompensasCanjeadas, setRecompensasCanjeadas] = useState([])
  const [vista, setVista] = useState("pedidos")
  const [isLoading, setIsLoading] = useState({})

  // Nuevos filtros para recompensas
  const [fechaRecompensaDesde, setFechaRecompensaDesde] = useState("")
  const [fechaRecompensaHasta, setFechaRecompensaHasta] = useState("")
  const [usuarioRecompensaFiltro, setUsuarioRecompensaFiltro] = useState("")
  const [recompensaNombreFiltro, setRecompensaNombreFiltro] = useState("")

  const { authTokens } = useAuth()
  const dateRef = useRef(null)

  useEffect(() => {
    api
      .get("orders/")
      .then((res) => setOrdenes(res.data))
      .catch((err) => console.error("Error al cargar órdenes:", err))
  }, [])

  useEffect(() => {
    const cargarRecompensas = async () => {
      const nuevasRecompensas = {}
      for (const orden of ordenes) {
        if (orden.usuario?.id) {
          try {
            const recompensas = await obtenerRecompensasPorUsuario(orden.usuario.id, authTokens?.access)
            nuevasRecompensas[orden.usuario.id] = recompensas
          } catch (e) {
            nuevasRecompensas[orden.usuario.id] = []
          }
        }
      }
      setRecompensasPorUsuario(nuevasRecompensas)
    }

    if (ordenes.length > 0) cargarRecompensas()
  }, [ordenes, authTokens])

  useEffect(() => {
    const cargarTodosCanjes = async () => {
      try {
        const data = await obtenerHistorialTodos(authTokens?.access)
        setRecompensasCanjeadas(data)
      } catch (e) {
        console.error("Error al obtener canjes:", e)
      }
    }
    cargarTodosCanjes()
  }, [authTokens])

  const formatearFecha = (fecha) => {
    const f = new Date(fecha)
    return f.toLocaleString()
  }

  const handleEstadoChange = (id, field, value) => {
    setActualizados((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  const guardarCambios = async (id) => {
    if (!actualizados[id]) return
    setIsLoading((prev) => ({ ...prev, [id]: true }))
    try {
      await api.patch(`orders/${id}/`, actualizados[id])
      alert("✅ Cambios guardados")
      window.location.reload()
    } catch (error) {
      alert("❌ Error al guardar cambios")
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const limpiarFiltros = () => {
    setFechaSeleccionada("")
    setEstadoReserva("")
    setEstadoPago("")
    setUsuarioFiltro("")
    setOrdenamiento("fecha_desc")
  }

  // Nueva función para limpiar filtros de recompensas
  const limpiarFiltrosRecompensas = () => {
    setFechaRecompensaDesde("")
    setFechaRecompensaHasta("")
    setUsuarioRecompensaFiltro("")
    setRecompensaNombreFiltro("")
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

  // Función para ordenar pedidos
  const ordenarPedidos = (pedidos) => {
    return [...pedidos].sort((a, b) => {
      switch (ordenamiento) {
        case "fecha_desc":
          return new Date(b.fecha_orden) - new Date(a.fecha_orden)
        case "fecha_asc":
          return new Date(a.fecha_orden) - new Date(b.fecha_orden)
        case "total_desc":
          return Number(b.total || 0) - Number(a.total || 0)
        case "total_asc":
          return Number(a.total || 0) - Number(b.total || 0)
        case "usuario_asc":
          const nombreA = `${a.usuario?.first_name} ${a.usuario?.last_name}`.toLowerCase()
          const nombreB = `${b.usuario?.first_name} ${b.usuario?.last_name}`.toLowerCase()
          return nombreA.localeCompare(nombreB)
        case "estado":
          if (a.estado_reserva !== b.estado_reserva) {
            return a.estado_reserva.localeCompare(b.estado_reserva)
          }
          return a.estado_pago.localeCompare(b.estado_pago)
        default:
          return 0
      }
    })
  }

  const ordenesFiltradas = ordenarPedidos(
    ordenes.filter((o) => {
      const fechaOk = fechaSeleccionada
        ? new Date(o.fecha_orden).toLocaleDateString("en-CA") === fechaSeleccionada
        : true
      const reservaOk = estadoReserva ? o.estado_reserva === estadoReserva : true
      const pagoOk = estadoPago ? o.estado_pago === estadoPago : true
      const usuarioOk = usuarioFiltro
        ? `${o.usuario?.first_name} ${o.usuario?.last_name}`.toLowerCase().includes(usuarioFiltro.toLowerCase())
        : true

      return fechaOk && reservaOk && pagoOk && usuarioOk
    }),
  )

  // Filtros para recompensas
  const recompensasFiltradas = recompensasCanjeadas.filter((r) => {
    const fechaDesdeOk = fechaRecompensaDesde ? new Date(r.fecha_canje) >= new Date(fechaRecompensaDesde) : true
    const fechaHastaOk = fechaRecompensaHasta ? new Date(r.fecha_canje) <= new Date(fechaRecompensaHasta) : true
    const usuarioOk = usuarioRecompensaFiltro
      ? r.usuario_nombre.toLowerCase().includes(usuarioRecompensaFiltro.toLowerCase())
      : true
    const recompensaOk = recompensaNombreFiltro
      ? r.recompensa_nombre.toLowerCase().includes(recompensaNombreFiltro.toLowerCase())
      : true

    return fechaDesdeOk && fechaHastaOk && usuarioOk && recompensaOk
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header mejorado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
              <span className="text-4xl">📋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Gestión de Pedidos
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Administra pedidos y recompensas de manera eficiente</p>
            </div>
          </div>
          <Link
            to="/admin-panel"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <HiArrowLeft className="text-lg" />
            Volver al panel
          </Link>
        </div>

        {/* Toggle de vista mejorado */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setVista("pedidos")}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                vista === "pedidos"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
              }`}
            >
              <HiEye className="text-xl" />
              Ver Pedidos ({ordenes.length})
            </button>
            <button
              onClick={() => setVista("recompensas")}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                vista === "recompensas"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
              }`}
            >
              <HiGift className="text-xl" />
              Recompensas Canjeadas ({recompensasCanjeadas.length})
            </button>
          </div>
        </div>

        {vista === "recompensas" ? (
          /* Vista de Recompensas con filtros mejorados */
          <div className="space-y-8">
            {/* Filtros para recompensas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                Filtros de Recompensas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-700 mb-3">Fecha Desde</label>
                  <input
                    type="date"
                    value={fechaRecompensaDesde}
                    onChange={(e) => setFechaRecompensaDesde(e.target.value)}
                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 bg-white/90 focus:ring-2 text-black focus:ring-amber-500 focus:border-amber-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-700 mb-3">Fecha Hasta</label>
                  <input
                    type="date"
                    value={fechaRecompensaHasta}
                    onChange={(e) => setFechaRecompensaHasta(e.target.value)}
                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 bg-white/90 focus:ring-2 text-black focus:ring-amber-500 focus:border-amber-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-700 mb-3">Usuario</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={usuarioRecompensaFiltro}
                    onChange={(e) => setUsuarioRecompensaFiltro(e.target.value)}
                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-700 mb-3">Recompensa</label>
                  <input
                    type="text"
                    placeholder="Buscar recompensa..."
                    value={recompensaNombreFiltro}
                    onChange={(e) => setRecompensaNombreFiltro(e.target.value)}
                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={limpiarFiltrosRecompensas}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>🗑️</span>
                  Limpiar filtros
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded-xl border border-amber-300">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-amber-800">{recompensasFiltradas.length}</span>
                  <span className="text-amber-700">recompensa(s) encontrada(s)</span>
                </div>
              </div>
            </div>

            {/* Lista de recompensas mejorada */}
            {recompensasFiltradas.length === 0 ? (
              <div className="text-center py-20">
                <div className="p-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <span className="text-6xl">🎁</span>
                </div>
                <p className="text-slate-500 text-2xl font-semibold">No hay recompensas canjeadas</p>
                <p className="text-slate-400 mt-3 text-lg">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {recompensasFiltradas.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform"
                  >
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg">
                        <span className="text-3xl">🏆</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className="text-2xl font-bold text-slate-800">{r.usuario_nombre}</h3>
                          <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-bold border-2 border-amber-300">
                            ✨ Recompensa canjeada
                          </span>
                        </div>
                        <p className="text-xl font-bold text-amber-700 mb-3">{r.recompensa_nombre}</p>
                        <p className="text-slate-600 mb-5 text-lg leading-relaxed">{r.recompensa_descripcion}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                          <span className="text-lg">📅</span>
                          <span className="font-semibold">
                            Canjeado el{" "}
                            {new Date(r.fecha_canje).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Vista de Pedidos mejorada */
          <>
            {/* Filtros mejorados */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                Filtros y Ordenamiento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Fecha</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                      ref={dateRef}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-white/90 pr-12 focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                    />
                    <HiOutlineCalendar
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors text-xl"
                      onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.focus()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Usuario</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={usuarioFiltro}
                    onChange={(e) => setUsuarioFiltro(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Estado Reserva</label>
                  <select
                    value={estadoReserva}
                    onChange={(e) => setEstadoReserva(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aceptado">Aceptado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Estado Pago</label>
                  <select
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="verificado">Verificado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Ordenar por</label>
                  <select
                    value={ordenamiento}
                    onChange={(e) => setOrdenamiento(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-black bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                  >
                    <option value="fecha_desc">Fecha (Más reciente)</option>
                    <option value="fecha_asc">Fecha (Más antiguo)</option>
                    <option value="total_desc">Total (Mayor a menor)</option>
                    <option value="total_asc">Total (Menor a mayor)</option>
                    <option value="usuario_asc">Usuario (A-Z)</option>
                    <option value="estado">Estado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>🗑️</span>
                  Limpiar filtros
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-300">
                  <span className="text-xl">📊</span>
                  <span className="font-bold text-blue-800">{ordenesFiltradas.length}</span>
                  <span className="text-blue-700">pedido(s) encontrado(s)</span>
                </div>
              </div>
            </div>

            {/* Lista de pedidos mejorada */}
            {ordenesFiltradas.length === 0 ? (
              <div className="text-center py-20">
                <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <span className="text-6xl">📋</span>
                </div>
                <p className="text-slate-500 text-2xl font-semibold">No se encontraron pedidos</p>
                <p className="text-slate-400 mt-3 text-lg">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="space-y-8">
                {ordenesFiltradas.map((orden) => {
                  const isCompleted = orden.estado_reserva === "entregado" && orden.estado_pago === "verificado"

                  return (
                    <div
                      key={orden.id}
                      className={`bg-white/90 backdrop-blur-sm border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-[1.01] ${
                        isCompleted
                          ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Header del pedido mejorado */}
                      <div
                        className={`px-8 py-6 border-b-2 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200"
                            : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div
                              className={`p-4 rounded-2xl shadow-lg ${
                                isCompleted
                                  ? "bg-gradient-to-br from-green-200 to-emerald-200"
                                  : "bg-gradient-to-br from-slate-200 to-slate-300"
                              }`}
                            >
                              {isCompleted ? (
                                <HiCheckCircle className="text-3xl text-green-600" />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-800">Pedido #{orden.id}</h3>
                              <p className="text-slate-600 font-semibold text-lg">
                                {orden.usuario?.first_name} {orden.usuario?.last_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">
                              ${Number(orden.total || 0).toFixed(2)}
                            </p>
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

                      <div className="p-8">
                        {/* Estados mejorados */}
                        <div className="flex flex-wrap gap-4 mb-8">
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

                        {/* Items del pedido mejorados */}
                        {orden.items?.length > 0 && (
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border-2 border-slate-200">
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
                                    {item.menu_nombre}{" "}
                                    <span className="text-blue-600 font-bold">x {item.cantidad}</span>
                                  </span>
                                  <span className="font-bold text-emerald-600 text-lg">${item.subtotal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comprobante mejorado */}
                        {orden.comprobante_pago && (
                          <div className="mb-8">
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

                        {/* Recompensas mejoradas */}
                        {recompensasPorUsuario[orden.usuario?.id]?.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
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

                        {/* Controles de estado mejorados */}
                        {!isCompleted && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-200">
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
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default AdminPedidosPage
