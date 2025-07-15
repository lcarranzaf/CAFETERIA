import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../services/api"
import SuccessModal from "./SuccessModal"
import Toast from "./Toast"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"

const MenuCard = ({ id, nombre, precio, descripcion, imagen, onAgregar, promedio = 5, cantidad = 0, extraContent }) => {
  const { user } = useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(false)


  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const destacar = async () => {
    try {
      await api.post(`menus/${id}/set_destacado/`)
      setToastMessage("✅ Plato marcado como destacado")
      setToastType("success")
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2500)
    } catch (err) {
      setToastMessage("❌ Error al marcar como destacado")
      setToastType("error")
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2500)
      console.error(err)
    }
  }

  const handleAgregar = () => {
    if (onAgregar) {
      onAgregar()
      setModalVisible(true)
      setTimeout(() => setModalVisible(false), 2000)
    }
  }

  const renderEstrellas = (prom) => {
    const estrellas = []
    const valor = Number.parseFloat(prom.toFixed(1))
    const entero = Math.floor(valor)
    const decimal = valor - entero

    for (let i = 0; i < entero; i++) {
      estrellas.push(<FaStar key={`full-${i}`} className="text-orange-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />)
    }

    if (decimal >= 0.25 && decimal <= 0.75) {
      estrellas.push(<FaStarHalfAlt key="half" className="text-orange-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />)
    } else if (decimal > 0.75) {
      estrellas.push(<FaStar key="extra" className="text-orange-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />)
    }

    const restantes = 5 - estrellas.length
    for (let i = 0; i < restantes; i++) {
      estrellas.push(<FaRegStar key={`empty-${i}`} className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />)
    }

    return estrellas
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 py-6 sm:py-8 md:py-12 text-center flex flex-col justify-between h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 hover:border-purple-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-102 sm:hover:scale-105 cursor-pointer group max-w-sm mx-auto">

      <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 shadow-sm group-hover:shadow-md transition-all duration-300">
        <img
          src={imagen || "/plato.png"}
          alt={nombre}
          className="w-full h-24 sm:h-28 md:h-36 object-contain rounded-lg sm:rounded-xl group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
        <div className="flex items-center gap-0.5 sm:gap-1">{renderEstrellas(promedio)}</div>
        <span className="ml-1 sm:ml-2 text-gray-700 font-bold text-sm sm:text-base md:text-lg bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
          {promedio}
        </span>
      </div>

      <h3 className="font-bold capitalize text-lg sm:text-xl text-gray-800 mb-1 sm:mb-2 leading-tight group-hover:text-purple-700 transition-colors duration-300 px-1">
        {nombre}
      </h3>

      <p className="text-xs sm:text-sm text-gray-700 capitalize mb-2 sm:mb-3 leading-relaxed px-1 sm:px-2 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
        {descripcion}
      </p>

      <p className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4 bg-white rounded-full py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm inline-block group-hover:shadow-md group-hover:text-green-700 transition-all duration-300">
        ${Number(precio).toFixed(2)}
      </p>

      <button
        onClick={handleAgregar}
        disabled={!onAgregar}
        className={`w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 text-sm sm:text-base ${
          onAgregar ? "cursor-pointer" : "cursor-not-allowed opacity-50"
        }`}
      >
        <span className="flex items-center justify-center gap-1 sm:gap-2">
          <span className="text-base sm:text-lg font-bold text-green-600">+</span>
          <span className="capitalize">Agregar Al Pedido</span>
        </span>
      </button>

      {user?.is_staff && (
        <button
          onClick={destacar}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold sm:font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
        >
          <span className="flex items-center justify-center gap-1 sm:gap-2">
            <span>⭐</span>
            <span>Destacar</span>
          </span>
        </button>
      )}

      {extraContent && <div className="mt-1 sm:mt-2">{extraContent}</div>}

      {modalVisible && (
        <SuccessModal mensaje={`✅ ${nombre} agregado al pedido`} onClose={() => setModalVisible(false)} />
      )}

      <Toast message={toastMessage} show={toastVisible} type={toastType} />
    </div>
  )
}

export default MenuCard
