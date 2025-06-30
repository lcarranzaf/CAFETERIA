"use client"

import { useEffect, useState, useRef } from "react"
import api from "../services/api"
import Navbar from "../components/Navbar"
import { HiArrowLeft } from "react-icons/hi"
import { Link } from "react-router-dom"
import { obtenerRecompensasPorUsuario, obtenerHistorialTodos } from "../services/recompensasService"
import { useAuth } from "../context/AuthContext"

// Importar componentes
import FilterSidebar from "../components/Gestion_pedido_admin/FilterSidebar"
import ViewToggle from "../components/Gestion_pedido_admin/ViewToggle"
import PedidoCard from "../components/Gestion_pedido_admin/PedidoCard"
import RecompensaCard from "../components/Gestion_pedido_admin/RecompensaCard"

const AdminPedidosPage = () => {
  const [ordenes, setOrdenes] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [estadoReserva, setEstadoReserva] = useState("")
  const [estadoPago, setEstadoPago] = useState("")
  const [usuarioFiltro, setUsuarioFiltro] = useState("")
  const [ordenamiento, setOrdenamiento] = useState("fecha_desc")
  const [actualizados, setActualizados] = useState({})
  const [recompensasPorUsuario, setRecompensasPorUsuario] = useState({})
  const [recompensasCanjeadas, setRecompensasCanjeadas] = useState([])
  const [vista, setVista] = useState("pedidos")
  const [isLoading, setIsLoading] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filtros para recompensas
  const [fechaRecompensaDesde, setFechaRecompensaDesde] = useState("")
  const [fechaRecompensaHasta, setFechaRecompensaHasta] = useState("")
  const [usuarioRecompensaFiltro, setUsuarioRecompensaFiltro] = useState("")
  const [recompensaNombreFiltro, setRecompensaNombreFiltro] = useState("")

  const { authTokens } = useAuth()
  const dateRef = useRef(null)
  const dateHastaRef = useRef(null) // Agregar este nuevo ref

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
    setFechaHasta("")
    setEstadoReserva("")
    setEstadoPago("")
    setUsuarioFiltro("")
    setOrdenamiento("fecha_desc")
  }

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
      const fechaOrden = new Date(o.fecha_orden).toLocaleDateString("en-CA")
      const fechaDesdeOk = fechaSeleccionada ? fechaOrden >= fechaSeleccionada : true
      const fechaHastaOk = fechaHasta ? fechaOrden <= fechaHasta : true
      const reservaOk = estadoReserva ? o.estado_reserva === estadoReserva : true
      const pagoOk = estadoPago ? o.estado_pago === estadoPago : true
      const usuarioOk = usuarioFiltro
        ? `${o.usuario?.first_name} ${o.usuario?.last_name}`.toLowerCase().includes(usuarioFiltro.toLowerCase())
        : true

      return fechaDesdeOk && fechaHastaOk && reservaOk && pagoOk && usuarioOk
    }),
  )

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

      <div className="flex pt-4">
        {/* Sidebar de Filtros */}
        <FilterSidebar
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
          estadoReserva={estadoReserva}
          setEstadoReserva={setEstadoReserva}
          estadoPago={estadoPago}
          setEstadoPago={setEstadoPago}
          usuarioFiltro={usuarioFiltro}
          setUsuarioFiltro={setUsuarioFiltro}
          ordenamiento={ordenamiento}
          setOrdenamiento={setOrdenamiento}
          limpiarFiltros={limpiarFiltros}
          ordenesFiltradas={ordenesFiltradas}
          fechaRecompensaDesde={fechaRecompensaDesde}
          setFechaRecompensaDesde={setFechaRecompensaDesde}
          fechaRecompensaHasta={fechaRecompensaHasta}
          setFechaRecompensaHasta={setFechaRecompensaHasta}
          usuarioRecompensaFiltro={usuarioRecompensaFiltro}
          setUsuarioRecompensaFiltro={setUsuarioRecompensaFiltro}
          recompensaNombreFiltro={recompensaNombreFiltro}
          setRecompensaNombreFiltro={setRecompensaNombreFiltro}
          limpiarFiltrosRecompensas={limpiarFiltrosRecompensas}
          recompensasFiltradas={recompensasFiltradas}
          vista={vista}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          dateRef={dateRef}
          dateHastaRef={dateHastaRef} // Agregar esta línea
        />

        {/* Contenido Principal */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Gestión de Pedidos
                </h1>
                <p className="text-slate-600 text-sm">Administra pedidos y recompensas</p>
              </div>
            </div>
            <Link
              to="/admin-panel"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HiArrowLeft className="text-sm" />
              Volver
            </Link>
          </div>

          {/* Toggle de vista */}
          <ViewToggle vista={vista} setVista={setVista} ordenes={ordenes} recompensasCanjeadas={recompensasCanjeadas} />

          {/* Contenido según la vista */}
          {vista === "recompensas" ? (
            <div className="space-y-8">
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
                    <RecompensaCard key={r.id} recompensa={r} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
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
                  {ordenesFiltradas.map((orden) => (
                    <PedidoCard
                      key={orden.id}
                      orden={orden}
                      formatearFecha={formatearFecha}
                      getEstadoColor={getEstadoColor}
                      recompensasPorUsuario={recompensasPorUsuario}
                      handleEstadoChange={handleEstadoChange}
                      guardarCambios={guardarCambios}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPedidosPage
