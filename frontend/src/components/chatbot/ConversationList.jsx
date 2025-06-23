"use client"

const ConversationList = ({
  conversaciones,
  conversacionActual,
  cargandoConversaciones,
  cargarConversacion,
  eliminarConversacion,
}) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
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
                  {conv.last_message && <p className="text-xs text-gray-600 mt-1 truncate">{conv.last_message}</p>}
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
  )
}

export default ConversationList
