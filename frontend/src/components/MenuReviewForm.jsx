import { useEffect, useState } from "react"
import api from "../services/api"
import Modal from "./Modal"
import { MdRateReview, MdStar } from "react-icons/md"
import { FaRegEye, FaUser, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"
import { BsChatLeftText } from "react-icons/bs"
import Toast from "./Toast"

const MenuReviewForm = ({ menuId,nombreMenu }) => {
  const [comentario, setComentario] = useState("")
  const [calificacion, setCalificacion] = useState(5)
  const [yaComentado, setYaComentado] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [reseñas, setReseñas] = useState([])
  const [vistaActiva, setVistaActiva] = useState("calificar")
  const [promedioGlobal, setPromedioGlobal] = useState(5)
  const [cantidad, setCantidad] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  useEffect(() => {
    api
      .get("/reviews/")
      .then((res) => {
        const lista = res.data.filter((r) => Number(r.menu) === Number(menuId))
        setReseñas(lista)

        const existe = lista.find((r) => r.es_del_usuario)
        if (existe) {
          setYaComentado(true)
          setComentario(existe.comentario)
          setCalificacion(existe.calificacion)
        }

        if (lista.length > 0) {
          const total = lista.reduce((acc, r) => acc + r.calificacion, 0)
          setPromedioGlobal((total / lista.length).toFixed(1))
          setCantidad(lista.length)
        } else {
          setPromedioGlobal(5)
          setCantidad(0)
        }
      })
      .catch((err) => console.error("Error al cargar reseñas:", err))
  }, [menuId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const nuevaReseña = {
        menu: menuId,
        comentario,
        calificacion,
        es_del_usuario: true,
        usuario_nombre: "Tú"
      }

      await api.post("/reviews/", nuevaReseña)

      const nuevasReseñas = [...reseñas, nuevaReseña]
      setReseñas(nuevasReseñas)

      const total = nuevasReseñas.reduce((acc, r) => acc + r.calificacion, 0)
      setPromedioGlobal((total / nuevasReseñas.length).toFixed(1))
      setCantidad(nuevasReseñas.length)

     
      setYaComentado(true)
      setVistaActiva("ver") 
      setMensaje("") 
      setToastMessage("✅ Reseña guardada correctamente")
      setToastType("success")
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    } catch (error) {
      setToastMessage("❌ Ya comentaste o hubo un error")
      setToastType("error")
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    }
  }


  
  const renderStars = (rating, size = "w-5 h-5") => {
    const estrellas = []
    const entero = Math.floor(rating)
    const decimal = rating - entero

    for (let i = 0; i < entero; i++) {
      estrellas.push(<FaStar key={`full-${i}`} className={`${size} text-yellow-400`} />)
    }

    if (decimal >= 0.25 && decimal <= 0.75) {
      estrellas.push(<FaStarHalfAlt key="half" className={`${size} text-yellow-400`} />)
    } else if (decimal > 0.75) {
      estrellas.push(<FaStar key="extra" className={`${size} text-yellow-400`} />)
    }

    const restantes = 5 - estrellas.length
    for (let i = 0; i < restantes; i++) {
      estrellas.push(<FaRegStar key={`empty-${i}`} className={`${size} text-gray-300`} />)
    }

    return estrellas
  }

  return (
    <div>
      <button
        onClick={() => {
          setModalOpen(true)
          setVistaActiva("calificar")
        }}
        className="group w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-gray-800 font-semibold py-4 px-6 rounded-2xl mb-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:border-blue-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-center gap-3">
          <MdRateReview className="text-2xl text-blue-600 group-hover:text-blue-700 transition-colors" />
          <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ver / Calificar este menú
          </span>
        </div>
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reseñas del Menú</h2>
            
            <div className="flex items-center justify-center mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-sm md:text-base font-bold px-4 py-2 rounded-full shadow-sm border border-indigo-300">
                🍽️ {nombreMenu}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Comparte tu experiencia o lee opiniones</p>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setVistaActiva("calificar")}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-gray-300 ${
                vistaActiva === "calificar"
                  ? "bg-white text-blue-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <MdRateReview className="text-lg" />
              <span>Calificar</span>
            </button>
            <button
              onClick={() => setVistaActiva("ver")}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-gray-300 ${
                vistaActiva === "ver"
                  ? "bg-white text-blue-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaRegEye className="text-lg" />
              <span>Ver reseñas</span>
            </button>
          </div>

          {vistaActiva === "calificar" && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              {!yaComentado ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className=" mb-3 font-bold text-gray-800 text-lg flex items-center gap-2">
                      <FaStar className="text-yellow-400" /> Tu Calificación
                    </label>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <select
                        value={calificacion}
                        onChange={(e) => setCalificacion(Number(e.target.value))}
                        className="w-full border-2 border-gray-300 font-semibold rounded-lg px-4 py-3 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        required
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>
                            {val} estrella{val > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-center mt-3">{renderStars(calificacion, "w-8 h-8")}</div>
                    </div>
                  </div>

                  <div>
                    <label className=" mb-3 font-bold text-gray-800 text-lg flex items-center gap-2">
                      <BsChatLeftText className="text-blue-500" /> Tu Comentario
                    </label>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={4}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="Cuéntanos sobre tu experiencia con este menú..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    🚀 Enviar mi reseña
                  </button>

                  {mensaje && (
                    <div
                      className={`p-4 rounded-lg text-center font-semibold ${
                        mensaje.includes("✅")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {mensaje}
                    </div>
                  )}
                </form>
              ) : (
                <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">¡Gracias por tu reseña!</h3>
                    <div className="flex justify-center mb-3">{renderStars(calificacion, "w-7 h-7")}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">
                      <FaStar className="inline-block text-yellow-400 mr-2" />
                      <span className="font-bold">Tu calificación:</span> {calificacion} estrella
                      {calificacion > 1 ? "s" : ""}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2 mt-3">
                      <BsChatLeftText className="text-blue-500" />
                      <span className="font-bold text-blue-600">Tu comentario:</span>
                    </p>
                    <p className="text-gray-800 italic mt-2 bg-white p-3 rounded border-l-4 border-blue-400">
                      "{comentario}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {vistaActiva === "ver" && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Calificación General</h3>
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <span className="text-4xl font-bold text-blue-600">{promedioGlobal}</span>
                    <div className="flex">{renderStars(parseFloat(promedioGlobal), "w-6 h-6")}</div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {cantidad} reseña{cantidad !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className=" space-y-4 pr-2 ">
                {reseñas.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg font-medium mb-2">Aún no hay reseñas para este menú</p>
                    <p className="text-gray-400">¡Sé el primero en compartir tu experiencia!</p>
                  </div>
                ) : (
                  reseñas.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaUser className="text-blue-600 w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800">{r.usuario_nombre || "Usuario Anónimo"}</span>
                            <div className="flex">{renderStars(r.calificacion, "w-4 h-4")}</div>
                          </div>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                            "{r.comentario}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Toast message={toastMessage} show={toastVisible} type={toastType} />
    </div>
  )
}

export default MenuReviewForm
