"use client"

const ChatMessages = ({ mensajes, mensajesRef, cargando, error, pregunta, setPregunta, handleEnviar }) => {
  const sugerencias = [
    "¿Receta de pasta carbonara?",
    "¿Menú semanal saludable?",
    "¿Qué cocinar con pollo?",
    "¿Técnicas básicas de cocina?",
  ]

  return (
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

            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs text-gray-500 mb-2">💡 Prueba preguntando:</p>
              {sugerencias.map((sugerencia, idx) => (
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
            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Pregunta sobre cocina..."
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            disabled={cargando}
          />
          <button
            type="submit"
            disabled={cargando || !pregunta.trim()}
            className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cargando ? "..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatMessages
