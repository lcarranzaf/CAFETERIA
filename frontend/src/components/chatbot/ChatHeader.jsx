
const ChatHeader = ({ vistaActual, setVistaActual, conversaciones, nuevaConversacion }) => {
  return (
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
                ? "bg-orange-100 text-orange-700 font-medium"
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
  )
}

export default ChatHeader
