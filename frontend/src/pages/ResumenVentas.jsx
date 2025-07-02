"use client"

import { useEffect, useState } from "react"
import api from "../services/api"
import Navbar from "../components/Navbar"
import { FaBoxOpen, FaDollarSign, FaChartBar, FaCalendarAlt } from "react-icons/fa"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const ResumenVentas = () => {
  const [datos, setDatos] = useState(null)
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0]
    setFechaDesde(hoy)
    setFechaHasta(hoy)
  }, [])

  useEffect(() => {
    if (fechaDesde && fechaHasta) {
      api
        .get(`/resumen-ventas/?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`)
        .then((res) => {
          const ordenados = res.data.mas_vendidos.sort((a, b) => b.cantidad - a.cantidad)
          setDatos({ ...res.data, mas_vendidos: ordenados })
        })
        .catch((err) => console.error("❌ Error al cargar resumen:", err))
    }
  }, [fechaDesde, fechaHasta])

  const chartData = {
    labels: datos?.mas_vendidos.map((p) => p.menu) || [],
    datasets: [
      {
        label: "Unidades vendidas",
        data: datos?.mas_vendidos.map((p) => p.cantidad) || [],
        backgroundColor: "rgba(255, 179, 71, 0.7)",
        borderColor: "rgba(255, 179, 71, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      y: {
        ticks: { color: "#374151", font: { size: 13, weight: "500" } },
        grid: { display: false },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  }

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  const obtenerTextoRango = () =>
    fechaDesde === fechaHasta
      ? formatearFecha(fechaDesde)
      : `${formatearFecha(fechaDesde)} - ${formatearFecha(fechaHasta)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <FaChartBar className="text-white text-2xl" />
              </div>
              Resumen de Ventas
            </h1>
            <p className="text-gray-600 mt-2">Análisis detallado de tus ventas y productos</p>
          </div>

          {/* Fechas */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Período:</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Desde</label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 text-sm">—</span>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Hasta</label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  min={fechaDesde}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {datos ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Gráfico de barras */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🍽️</span>
                    Todos los Menús - {obtenerTextoRango()}
                  </h3>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {datos.mas_vendidos?.length || 0} productos
                  </div>
                </div>
                <div className="h-[28rem]"> {/* Aumentamos tamaño del gráfico */}
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="xl:col-span-1 space-y-6">
              <MetricCard
                icon={<FaBoxOpen className="text-2xl" />}
                title="Productos Vendidos"
                value={datos.total_productos}
                subtitle="unidades"
                color="from-blue-500 to-blue-600"
              />
              <MetricCard
                icon={<FaChartBar className="text-2xl" />}
                title="Pedidos Completados"
                value={datos.total_pedidos}
                subtitle="órdenes"
                color="from-green-500 to-green-600"
              />
              <MetricCard
                icon={<FaDollarSign className="text-2xl" />}
                title="Total Recaudado"
                value={`$${Number(datos.total_recaudado).toFixed(2)}`}
                subtitle="ingresos"
                color="from-emerald-500 to-emerald-600"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando resumen de ventas...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const MetricCard = ({ icon, title, value, subtitle, color }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-gradient-to-r ${color} rounded-xl text-white shadow-lg`}>{icon}</div>
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
    </div>
  </div>
)

export default ResumenVentas
