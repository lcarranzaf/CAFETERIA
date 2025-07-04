import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import useNotificaciones from "../hooks/useNotificaciones"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { CheckCircle, XCircle, AlertTriangle, ShoppingCart } from "lucide-react"

const NotificacionesPage = () => {
  const { user } = useContext(AuthContext)
  const { notificaciones, cargarNotificaciones, marcarComoLeidas } = useNotificaciones()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else {
      cargarNotificaciones()
      marcarComoLeidas()
    }
  }, [user])

  const renderIcono = (mensaje) => {
    if (mensaje.includes("verificado")) return <CheckCircle className="text-green-500" />
    if (mensaje.includes("rechazado")) return <XCircle className="text-red-500" />
    if (mensaje.includes("entregado")) return <CheckCircle className="text-blue-500" />
    if (mensaje.includes("Nuevo pedido")) return <ShoppingCart className="text-yellow-600" />
    return <AlertTriangle className="text-gray-500" />
  }

  const renderColor = (mensaje) => {
    if (mensaje.includes("verificado")) return "border-green-500"
    if (mensaje.includes("rechazado")) return "border-red-500"
    if (mensaje.includes("entregado")) return "border-blue-500"
    if (mensaje.includes("Nuevo pedido")) return "border-yellow-600"
    return "border-gray-300"
  }

  const renderMensaje = (mensaje) => {
    if (!mensaje.includes("Nuevo pedido")) {
      return (
        <p className="text-base text-gray-800 whitespace-pre-line">
          {mensaje.replace(/\s?\[VER_PEDIDO:\d+\]/, "")}
        </p>
      )
    }

    const sinTag = mensaje.replace(/\s?\[VER_PEDIDO:\d+\]/, "")
    const partes = sinTag.split(" - ")

    const usuarioRaw = partes[0]?.replace("Nuevo pedido de ", "") || ""
    const ordenEItems = partes[1] || ""

    const [ordenRaw, itemsRaw] = ordenEItems.split("Ítems:")
    const nombreUsuario = usuarioRaw.split(" (")[0]
    const username = usuarioRaw.match(/\(usuario: (.+)\)/)?.[1] || ""

    const itemsList = itemsRaw
      ? itemsRaw.split("|").map((item) => item.trim()).filter(Boolean)
      : []

    return (
      <div className="text-gray-800 text-base space-y-2">
        <div>
          <p className="font-semibold text-black">Nuevo pedido de {nombreUsuario}</p>
          <p className="text-sm italic text-gray-600">Usuario: {username}</p>
        </div>
        <div className="flex items-start gap-1">
          <span>🧾</span>
          <p className="text-sm">{ordenRaw.trim()}</p>
        </div>
        {itemsList.length > 0 && (
          <div>
            <p className="text-sm mb-1">🍽️ Ítems:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {itemsList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-indigo-700">📨 Notificaciones</h2>

          {notificaciones.length === 0 ? (
            <p className="text-gray-600 text-center">No tienes notificaciones nuevas.</p>
          ) : (
            <ul className="space-y-6">
              {notificaciones.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex items-start gap-4 bg-white shadow p-5 border-l-4 rounded-md ${renderColor(notif.mensaje)} hover:shadow-lg transition`}
                >
                  <div className="pt-1">{renderIcono(notif.mensaje)}</div>
                  <div className="flex-1 space-y-2">
                    {renderMensaje(notif.mensaje)}
                    <p className="text-sm text-gray-500">
                      {new Date(notif.creado_en).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificacionesPage
