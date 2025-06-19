"use client"

import { useEffect, useState, useContext } from "react"
import api from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { OrderContext } from "../context/OrderContext"
import { Link } from "react-router-dom"
import Toast from "./Toast"

const HeroSection = () => {
  const { user } = useContext(AuthContext)
  const { agregarAlPedido } = useContext(OrderContext)
  const [destacado, setDestacado] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get("menus/")
      .then((res) => {
        const found = res.data.find((item) => item.destacado === true)
        setDestacado(found)
      })
      .catch((err) => {
        console.error("Error cargando menú destacado:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleAgregar = () => {
    if (destacado && agregarAlPedido) {
      agregarAlPedido(destacado)
      setToastMessage(`${destacado.nombre} agregado al pedido`)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2000)
    }
  }

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* LADO IZQUIERDO */}
          <div className="flex-1 text-center md:text-left max-w-2xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-indigo-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Disponible ahora
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Tu comida en el campus,
                </span>
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  en un clic.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Menú digital, reservas anticipadas y recompensas en un solo lugar.
                <span className="block mt-2 font-semibold text-gray-800">¡Ordena ahora y evita las colas! ⚡</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/menu"
                className="group bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 hover:text-black"
              >
                Empezar ahora
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>

          {/* LADO DERECHO */}
          <div className="flex-1 relative text-center">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mx-auto shadow-lg"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative ">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-indigo-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500 animate-pulse "></div>

                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 border border-white/20 w-full max-w-sm mx-auto">
                    <img
                      src={destacado?.imagen || "/plato.png"}
                      alt={destacado?.nombre || "plato principal"}
                      className={`w-64 md:w-80 rounded-2xl mx-auto transition-all duration-700 ${
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      } group-hover:scale-105`}
                      onLoad={() => setImageLoaded(true)}
                    />

                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-200 to-orange-400 text-white rounded-full p-3 shadow-lg animate-bounce-slow">
                      <span className="text-lg">⭐</span>
                    </div>

                    <div className="hidden md:block absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="font-bold text-gray-800">{destacado?.promedio_calificacion || 5}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        {destacado?.cantidad_reviews || 0} valoraciones
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div
                          className="bg-gradient-to-r from-yellow-300 to-orange-400 h-1 rounded-full"
                          style={{
                            width: `${((destacado?.promedio_calificacion || 5) / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {destacado && (
                  <div className="mt-8 space-y-4 animate-fade-in-up delay-300">
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {destacado.nombre}
                      </h2>

                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          ${destacado.precio}
                        </span>
                      </div>

                      <div className="block md:hidden">
                        <div className="inline-flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {destacado?.promedio_calificacion || 5}
                          </span>
                          <span className="text-xs text-gray-600">
                            {destacado?.cantidad_reviews || 0} valoraciones
                          </span>
                        </div>
                      </div>

                      {user && (
                        <button
                          onClick={handleAgregar}
                          className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                        >
                          <span className="group-hover:scale-110 transition-transform duration-300">🛒</span>
                          Agregar al pedido
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} show={toastVisible} type="success" />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </section>
  )
}

export default HeroSection
