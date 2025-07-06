"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HiOutlineMenu, HiOutlineShoppingCart, HiX, HiBell } from "react-icons/hi"
import { AuthContext } from "../../context/AuthContext"
import { OrderContext } from "../../context/OrderContext"
import PedidoModal from "../PedidoModal"
import useNotificaciones from "../../hooks/useNotificaciones"

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext)
  const { pedido } = useContext(OrderContext)
  const [isOpen, setIsOpen] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const navigate = useNavigate()
  const { nuevas } = useNotificaciones()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    logoutUser()
    closeMenu()
  }

  const handleIrNotificaciones = () => {
    navigate("/notificaciones")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu") && !event.target.closest(".menu-trigger")) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative">
        {/* Izquierda */}
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <img src="/Logo.png" alt="Logo" className="h-10" />
            <h1 className="text-lg font-bold">BYTEBAR</h1>
          </div>

          <ul className="hidden md:flex space-x-6 font-medium">
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/menu">Menú</Link></li>
            {user && <li><Link to="/reservas">Reservas</Link></li>}
            <li><Link to="/recompensas">Recompensas</Link></li>
            {user?.is_staff && <li><Link to="/gestionar-menus">Gestionar Menú</Link></li>}
            {user?.is_staff && <li><Link to="/admin-panel">Panel Administrador</Link></li>}
          </ul>
        </div>

        {/* Derecha - Desktop */}
        <div className="hidden md:flex items-center gap-4 ml-auto text-sm font-medium relative">
          {user && (
            <button onClick={handleIrNotificaciones} className="relative bg-white">
              <HiBell className="text-2xl text-gray-700" />
              {nuevas > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {nuevas}
                </span>
              )}
            </button>
          )}

          {user && pedido.length > 0 && (
            <button onClick={() => setModalAbierto(true)} className="relative bg-white">
              <HiOutlineShoppingCart className="text-2xl text-indigo-600" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {pedido.length}
              </span>
            </button>
          )}
          {user ? (
            <>
              <div className="flex items-center gap-2 text-black px-3 py-1 rounded-full">
                <span className="text-yellow-500 text-lg">👤</span>
                <span className="text-sm font-medium capitalize">
                  {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                </span>
              </div>
              <button
                onClick={logoutUser}
                className="!bg-red-100 !text-red-600 !border-red-200 px-2 py-1 rounded hover:!bg-red-200 text-xs border transition-colors"
                style={{ backgroundColor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="!text-indigo-600 hover:underline font-medium" style={{ color: "#4f46e5" }}>Login</Link>
              <Link to="/register" className="!text-indigo-600 hover:underline font-medium" style={{ color: "#4f46e5" }}>Register</Link>
            </>
          )}
        </div>

        {/* Menú móvil - Trigger */}
        <div className="md:hidden flex items-center gap-3">
          {user && pedido.length > 0 && (
            <button onClick={() => setModalAbierto(true)} className="relative bg-white">
              <HiOutlineShoppingCart className="text-2xl text-indigo-600" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {pedido.length}
              </span>
            </button>
          )}
          {user && (
            <button onClick={handleIrNotificaciones} className="relative bg-white">
              <HiBell className="text-2xl text-gray-700" />
              {nuevas> 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {nuevas}
                </span>
              )}
            </button>
          )}
          <button onClick={toggleMenu} className="menu-trigger bg-amber-100 text-gray-700 focus:outline-none p-2">
            <HiOutlineMenu size={24} />
          </button>
        </div>
      </nav>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMenu} />
          <div className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <img src="/Logo.png" alt="Logo" className="h-8" />
                <h2 className="text-lg font-bold">BYTEBAR</h2>
              </div>
              <button onClick={closeMenu} className="p-2 bg-amber-100 hover:bg-gray-100 rounded-full">
                <HiX size={20} />
              </button>
            </div>

            {user && (
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-black px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-yellow-500 text-lg">👤</span>
                  <span className="text-sm font-medium capitalize">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                  </span>
                </div>
              </div>
            )}

            <div className="px-6 py-4 flex-1">
              <nav className="flex flex-col space-y-1">
                <Link to="/home" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Inicio</Link>
                <Link to="/menu" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Menú</Link>
                {user && <Link to="/reservas" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Reservas</Link>}
                <Link to="/recompensas" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Recompensas</Link>
                {user && <button onClick={() => { closeMenu(); handleIrNotificaciones(); }} className="text-left text-lg bg-white font-medium text-indigo-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg w-full">Notificaciones 🔔 {notificacionesNoLeidas > 0 && `(${notificacionesNoLeidas})`}</button>}
                {user?.is_staff && (
                  <>
                    <Link to="/gestionar-menus" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Gestionar Menú</Link>
                    <Link to="/admin-panel" onClick={closeMenu} className="text-lg font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg">Panel Administrador</Link>
                  </>
                )}
              </nav>
            </div>

            <div className="p-6 border-t">
              {user ? (
                <button onClick={handleLogout} className="w-full !bg-red-100 !text-red-600 hover:!bg-red-200 !border-red-200 px-4 py-2 rounded-lg font-medium transition-colors border" style={{ backgroundColor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}>
                  Cerrar sesión
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={closeMenu}><button className="w-full !bg-indigo-600 hover:!bg-indigo-700 !text-white px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: "#4f46e5", color: "white" }}>Iniciar Sesión</button></Link>
                  <Link to="/register" onClick={closeMenu}><button className="w-full !border-indigo-600 !text-indigo-600 hover:!bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors border bg-white" style={{ borderColor: "#4f46e5", color: "#4f46e5", backgroundColor: "white" }}>Registrarse</button></Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <PedidoModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} />
    </>
  )
}

export default Navbar
