"use client"

import { Link } from "react-router-dom"
import { HiChartBar, HiTrophy } from "react-icons/hi2"
import { HiClipboardList, HiUserAdd } from "react-icons/hi"
import Navbar from "../components/Navbar"

const options = [
  {
    title: "Crear Administrador",
    description: "Registrar un nuevo usuario con rol administrador.",
    icon: <HiUserAdd className="text-4xl" />,
    link: "/admin-panel/crear-admin",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
    stats: "Gestión de usuarios",
  },
  {
    title: "Ver Pedidos",
    description: "Revisar pedidos, ver comprobantes y cambiar su estado.",
    icon: <HiClipboardList className="text-4xl" />,
    link: "/admin-panel/pedidos",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
    stats: "Control de órdenes",
  },
  {
    title: "Recompensas",
    description: "Gestionar las recompensas para los usuarios.",
    icon: <HiTrophy className="text-4xl" />,
    link: "/admin-panel/reservas",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "hover:from-amber-600 hover:to-amber-700",
    stats: "Sistema de puntos",
  },
  {
    title: "Resumen de Ventas",
    description: "Ver productos vendidos y total recaudado hoy.",
    icon: <HiChartBar className="text-4xl" />,
    link: "/admin-panel/resumen-ventas",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
    stats: "Análisis financiero",
  },
]

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Navbar />

      <div className="px-6 py-10">
        {/* Header mejorado */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl shadow-lg">
              <span className="text-4xl">⚡</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Panel Administrador
              </h1>
              <p className="text-slate-600 text-lg mt-2">Centro de control y gestión</p>
            </div>
          </div>
        </div>

        

        {/* Opciones principales mejoradas */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {options.map((op, index) => (
              <Link
                key={index}
                to={op.link}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Gradient background overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${op.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start gap-6">
                    {/* Icon container */}
                    <div
                      className={`p-4 ${op.bgColor} ${op.borderColor} border-2 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <div className={`bg-gradient-to-r ${op.color} bg-clip-text text-transparent`}>{op.icon}</div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {op.title}
                        </h3>
                        <div className="p-1 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">→</span>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-3 leading-relaxed">{op.description}</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 ${op.bgColor} ${op.borderColor} border rounded-full text-sm font-medium`}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${op.color}`} />
                        {op.stats}
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${op.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg">
            <span className="text-lg">🔒</span>
            <p className="text-slate-600 font-medium">Panel seguro - Acceso autorizado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
