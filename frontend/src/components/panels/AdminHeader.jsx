const AdminHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl shadow-lg">
          <span className="text-4xl">⚡</span>
        </div>
        <div className="text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Panel Administrador
          </h1>
          <p className="text-slate-600 text-lg mt-2">Centro de control y gestión</p>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
