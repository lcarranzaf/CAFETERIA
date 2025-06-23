"use client"

import { useState, useEffect, useRef } from "react"
import api from "../../services/api"

const ChatbotAdmin = () => {
  const [pregunta, setPregunta] = useState("")
  const [mensajes, setMensajes] = useState([])
  const [conversaciones, setConversaciones] = useState([])
  const [conversacionActual, setConversacionActual] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [cargandoConversaciones, setCargandoConversaciones] = useState(false)
  const [error, setError] = useState(null)
  const [vistaActual, setVistaActual] = useState("chat") // "chat" o "conversaciones"

  const mensajesRef = useRef(null)

  useEffect(() => {
    cargarConversaciones()
  }, [])

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
    }
  }, [mensajes])

  const cargarConversaciones = async () => {
    setCargandoConversaciones(true)
    try {
      const res = await api.get("chatbot/conversations/")
      setConversaciones(res.data)
    } catch (err) {
      console.error("Error al cargar conversaciones:", err)
      if (err.response?.status === 404) {
        setConversaciones([])
      }
    } finally {
      setCargandoConversaciones(false)
    }
  }

  const cargarConversacion = async (conversacionId) => {
    setCargando(true)
    try {
      const res = await api.get(`chatbot/conversations/${conversacionId}/`)
      setMensajes(res.data.messages || [])
      setConversacionActual(conversacionId)
      setVistaActual("chat")
    } catch (err) {
      setError("Error al cargar la conversación.")
    } finally {
      setCargando(false)
    }
  }

  const nuevaConversacion = () => {
    setMensajes([])
    setConversacionActual(null)
    setError(null)
    setVistaActual("chat")
  }

  const eliminarConversacion = async (conversacionId) => {
    if (!window.confirm("¿Eliminar esta conversación?")) return

    try {
      await api.delete(`chatbot/conversations/${conversacionId}/`)
      setConversaciones((conv) => conv.filter((c) => c.id !== conversacionId))
      if (conversacionActual === conversacionId) {
        nuevaConversacion()
      }
    } catch (err) {
      setError("Error al eliminar la conversación.")
    }
  }

  const handleEnviar = async (e) => {
    e.preventDefault()
    if (!pregunta.trim()) return

    setCargando(true)
    setError(null)

    const mensajeUsuario = { role: "user", content: pregunta }
    setMensajes((prev) => [...prev, mensajeUsuario])

    try {
      const payload = { pregunta }
      if (conversacionActual) {
        payload.conversation_id = conversacionActual
      }

      const res = await api.post("chatbot/", payload)

      const mensajeChatbot = {
        id: res.data.message_id,
        role: "assistant",
        content: res.data.respuesta,
      }

      setMensajes((prev) => [...prev, mensajeChatbot])

      if (!conversacionActual && res.data.conversation_id) {
        setConversacionActual(res.data.conversation_id)
        cargarConversaciones()
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al consultar al chatbot.")
      setMensajes((prev) => prev.slice(0, -1))
    } finally {
      setCargando(false)
      setPregunta("")
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
      {/* Header compacto */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg flex items-center justify-center">
            <span className="text-sm">🍳</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">ChefBot</h3>
            <p className="text-xs text-gray-500">Asistente Culinario</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Navegación entre vistas */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setVistaActual("chat")}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                vistaActual === "chat"
                  ? "bg-orange-100 text-orange-700 font-medium"
                  : "bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-800"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setVistaActual("conversaciones")}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                vistaActual === "conversaciones"
                  ? "bg-orange-100  text-orange-700 font-medium"
                  : "bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-800"
              }`}
            >
              Historial ({conversaciones.length})
            </button>
          </div>

          <button
            onClick={nuevaConversacion}
            className="px-3 py-1 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 transition-colors"
          >
            + Nueva
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        {vistaActual === "chat" ? (
          <div className="h-full flex flex-col">
            {/* Área de mensajes */}
            <div ref={mensajesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensajes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🍳</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">¡Hola! Soy ChefBot</h4>
                    <p className="text-sm text-gray-600 mb-4">¿En qué puedo ayudarte con la cocina?</p>
                  </div>

                  {/* Sugerencias compactas */}
                  <div className="w-full max-w-sm space-y-2">
                    <p className="text-xs text-gray-500 mb-2">💡 Prueba preguntando:</p>
                    {[
                      "¿Receta de pasta carbonara?",
                      "¿Menú semanal saludable?",
                      "¿Qué cocinar con pollo?",
                      "¿Técnicas básicas de cocina?",
                    ].map((sugerencia, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPregunta(sugerencia)}
                        className="w-full p-2 text-xs text-left bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-md transition-colors"
                      >
                        {sugerencia}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {mensajes.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {cargando && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">Escribiendo...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Input de mensaje */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleEnviar} className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm bg-gray-00 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Pregunta sobre cocina..."
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  disabled={cargando}
                />
                <button
                  type="submit"
                  disabled={cargando || !pregunta.trim()}
                  className="px-4 py-2 bg-orange-500  text-white text-sm rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cargando ? "..." : "Enviar"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Vista de conversaciones */
          <div className="h-full overflow-y-auto p-4">
            {cargandoConversaciones ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {conversaciones.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      conversacionActual === conv.id
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => cargarConversacion(conv.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-800 truncate">
                          {conv.title || `Conversación ${conv.id}`}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">{conv.message_count} mensajes</span>
                          <span className="text-xs text-gray-400">{formatearFecha(conv.updated_at)}</span>
                        </div>
                        {conv.last_message && (
                          <p className="text-xs text-gray-600 mt-1 truncate">{conv.last_message}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          eliminarConversacion(conv.id)
                        }}
                        className="text-gray-400 hover:text-red-500 text-xs ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {conversaciones.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg">💭</span>
                    </div>
                    <p className="text-sm text-gray-500">No hay conversaciones</p>
                    <p className="text-xs text-gray-400 mt-1">¡Empieza una nueva!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatbotAdmin
