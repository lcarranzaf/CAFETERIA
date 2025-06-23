"use client"

import { Link } from "react-router-dom"
import { getIcon } from "../../utils/iconMapper"

const AdminCard = ({ option, onClick }) => {
  const handleClick = (e) => {
    if (option.type === "chatbot" && onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Link
      to={option.link}
      onClick={handleClick}
      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full"
    >
      {/* Overlay de hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Contenido de la tarjeta */}
      <div className="relative p-8">
        <div className="flex items-start gap-6">
          {/* Cuadrito con ícono */}
          <div
            className={`p-4 ${option.bgColor} ${option.borderColor} border-2 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg flex items-center justify-center`}
          >
            <div className={option.iconColor}>{getIcon(option.iconType, `text-4xl ${option.iconColor}`)}</div>
          </div>

          {/* Contenido de texto */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                {option.title}
              </h3>
              <div className="p-1 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm">→</span>
              </div>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">{option.description}</p>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 ${option.bgColor} ${option.borderColor} border rounded-full text-sm font-medium`}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.color}`} />
              {option.stats}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />
      </div>
    </Link>
  )
}

export default AdminCard
