const RecompensaCard = ({ recompensa }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform">
      <div className="flex items-start gap-6">
        <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg">
          <span className="text-3xl">🏆</span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-800">{recompensa.usuario_nombre}</h3>
            <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-bold border-2 border-amber-300">
              ✨ Recompensa canjeada
            </span>
          </div>
          <p className="text-xl font-bold text-amber-700 mb-3">{recompensa.recompensa_nombre}</p>
          <p className="text-slate-600 mb-5 text-lg leading-relaxed">{recompensa.recompensa_descripcion}</p>
          <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
            <span className="text-lg">📅</span>
            <span className="font-semibold">
              Canjeado el{" "}
              {new Date(recompensa.fecha_canje).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecompensaCard
