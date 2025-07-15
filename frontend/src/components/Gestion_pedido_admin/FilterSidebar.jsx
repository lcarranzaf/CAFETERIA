const FilterSidebar = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  fechaHasta,
  setFechaHasta,
  estadoReserva,
  setEstadoReserva,
  estadoPago,
  setEstadoPago,
  usuarioFiltro,
  setUsuarioFiltro,
  numeroPedido,
  setNumeroPedido,
  ordenamiento,
  setOrdenamiento,
  limpiarFiltros,
  ordenesFiltradas,
  fechaRecompensaDesde,
  setFechaRecompensaDesde,
  fechaRecompensaHasta,
  setFechaRecompensaHasta,
  usuarioRecompensaFiltro,
  setUsuarioRecompensaFiltro,
  recompensaNombreFiltro,
  setRecompensaNombreFiltro,
  limpiarFiltrosRecompensas,
  recompensasFiltradas,
  vista,
  sidebarCollapsed,
  setSidebarCollapsed,
  dateRef,
  dateHastaRef,
}) => {
  const contarFiltrosActivos = () => {
    let count = 0
    if (vista === "pedidos") {
      if (fechaSeleccionada) count++
      if (fechaHasta) count++
      if (estadoReserva) count++
      if (estadoPago) count++
      if (usuarioFiltro) count++
      if (numeroPedido) count++
      if (ordenamiento !== "fecha_desc") count++
    } else {
      if (fechaRecompensaDesde) count++
      if (fechaRecompensaHasta) count++
      if (usuarioRecompensaFiltro) count++
      if (recompensaNombreFiltro) count++
    }
    return count
  }

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-80"
      } transition-all duration-300 bg-white shadow-xl border-r border-slate-200 min-h-[calc(100vh-80px)] sticky top-20`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                {vista === "pedidos" ? "Filtros Pedidos" : "Filtros Recompensas"}
              </h3>
              {contarFiltrosActivos() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{contarFiltrosActivos()}</span>
              )}
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <span className="text-lg">🔍</span> : <span className="text-lg">✖️</span>}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="space-y-6">
            {vista === "pedidos" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">📅</span>
                    Rango de Fechas
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Desde</label>
                      <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 cursor-pointer hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Hasta</label>
                      <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 cursor-pointer hover:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">🔢</span>
                    Número de Pedido
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por ID..."
                    value={numeroPedido}
                    onChange={(e) => setNumeroPedido(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">👤</span>
                    Usuario
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={usuarioFiltro}
                    onChange={(e) => setUsuarioFiltro(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">📦</span>
                    Estado de Reserva
                  </label>
                  <select
                    value={estadoReserva}
                    onChange={(e) => setEstadoReserva(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aceptado">Aceptado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">💳</span>
                    Estado de Pago
                  </label>
                  <select
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="verificado">Verificado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">🔄</span>
                    Ordenar por
                  </label>
                  <select
                    value={ordenamiento}
                    onChange={(e) => setOrdenamiento(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="fecha_desc">Fecha (Más reciente)</option>
                    <option value="fecha_asc">Fecha (Más antiguo)</option>
                    <option value="total_desc">Total (Mayor a menor)</option>
                    <option value="total_asc">Total (Menor a mayor)</option>
                    <option value="usuario_asc">Usuario (A-Z)</option>
                    <option value="estado">Estado</option>
                  </select>
                </div>

                <button
                  onClick={limpiarFiltros}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Limpiar filtros
                </button>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">{ordenesFiltradas.length}</p>
                    <p className="text-sm text-slate-600">pedidos encontrados</p>
                  </div>
                </div>
              </>
            ) : (
               <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">📅</span>
                    Rango de Fechas
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Desde</label>
                      <input
                        type="date"
                        value={fechaRecompensaDesde}
                        onChange={(e) => setFechaRecompensaDesde(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700 cursor-pointer hover:border-amber-400"
                        style={{
                          colorScheme: "light",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Hasta</label>
                      <input
                        type="date"
                        value={fechaRecompensaHasta}
                        onChange={(e) => setFechaRecompensaHasta(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700 cursor-pointer hover:border-amber-400"
                        style={{
                          colorScheme: "light",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                    <span className="text-lg">👤</span>
                    Usuario
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={usuarioRecompensaFiltro}
                    onChange={(e) => setUsuarioRecompensaFiltro(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3  items-center gap-2">
                    <span className="text-lg">🎁</span>
                    Recompensa
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar recompensa..."
                    value={recompensaNombreFiltro}
                    onChange={(e) => setRecompensaNombreFiltro(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700"
                  />
                </div>
                <button
                  onClick={limpiarFiltrosRecompensas}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Limpiar filtros
                </button>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-800">{recompensasFiltradas.length}</p>
                    <p className="text-sm text-amber-600">recompensas encontradas</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterSidebar
