import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/layout/Navbar"
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiStar,
  FiClock,
  FiCreditCard,
  FiAward
} from "react-icons/fi"
// import Footer from "../components/layout/Footer" // Descomenta si tienes Footer

const PerfilPage = () => {
  const { user } = useContext(AuthContext)
  const [activeTab] = useState("perfil")

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const getRoleBadge = (isStaff) => {
    return isStaff ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
        <FiShield className="w-4 h-4" />
        Administrador
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
        <FiUser className="w-4 h-4" />
        Cliente
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="flex-1">
        {/* Encabezado con fondo azul */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-10 px-6 text-white mb-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
              {getInitials(user.first_name, user.last_name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold capitalize">{user.first_name} {user.last_name}</h1>
              <div className="mt-2">{getRoleBadge(user.is_staff)}</div>
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeTab === "perfil" && (
              <>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-blue-600" />
                      Información Personal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FiUser className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-800 font-medium">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Nombre de Usuario</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FiUser className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-800 font-medium">@{user.username}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FiMail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-800 font-medium">{user.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Teléfono</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FiPhone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-800 font-medium">{user.telefono || "No registrado"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FiAward className="w-5 h-5 text-yellow-600" />
                      Mis Estadísticas
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiStar className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-gray-700">Estrellas</span>
                        </div>
                        <span className="text-xl font-bold text-yellow-600">{user.estrellas}</span>
                      </div>

                      <div className="flex flex-col gap-4">
                        {/* Pedidos */}
                        <div className="flex items-center justify-between p-4 bg-blue-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-200 rounded-full">
                              <FiClock className="w-6 h-6 text-blue-700" />
                            </div>
                            <span className="text-base font-semibold text-blue-800">Pedidos</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-800">
                            {user.pedidos || 0}
                          </span>
                        </div>

                        {/* Total Gastado */}
                        <div className="flex items-center justify-between p-4 bg-green-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-200 rounded-full">
                              <FiCreditCard className="w-6 h-6 text-green-700" />
                            </div>
                            <span className="text-base font-semibold text-green-800">Gastado</span>
                          </div>
                          <span className="text-2xl font-bold text-green-800">
                            S/ {user.total_gastado ? user.total_gastado.toFixed(2) : "0.00"}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PerfilPage
