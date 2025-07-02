import { HiEye, HiGift } from "react-icons/hi"

const ViewToggle = ({ vista, setVista, ordenes, recompensasCanjeadas }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setVista("pedidos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
            vista === "pedidos"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
          }`}
        >
          <HiEye className="text-lg" />
          Pedidos ({ordenes.length})
        </button>
        <button
          onClick={() => setVista("recompensas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
            vista === "recompensas"
              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
          }`}
        >
          <HiGift className="text-lg" />
          Recompensas ({recompensasCanjeadas.length})
        </button>
      </div>
    </div>
  )
}

export default ViewToggle
