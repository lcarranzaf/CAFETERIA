import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineShoppingCart } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import PedidoModal from "./PedidoModal";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { pedido } = useContext(OrderContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
            {user?.is_staff && <li><Link to="/gestionar-menus">Gestionar Menús</Link></li>}
            { user?.is_staff && <li>
                <Link to="/admin-panel"
                >
                  Panel Administrador
                </Link>
              </li>
            }
          </ul>
        </div>

        {/* Derecha */}
        <div className="hidden md:flex items-center gap-4 ml-auto text-sm font-medium relative">
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
              <div className="flex items-center gap-2 text-black px-3 py-1 rounded-full ">
                <span className="text-yellow-500 text-lg">👤</span>
                <span className="text-sm font-medium capitalize ">{user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
                </span>
              </div>
              <button
                onClick={logoutUser}
                className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
              <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
            </>
          )}
        </div>

        {/* Menú móvil */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <span className="pr-4 text-sm font-medium capitalize text-black">
              <span className="text-yellow-500 text-lg">👤</span>{' '}
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.username}
            </span>
          )}
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            <HiOutlineMenu size={28} />
          </button>
        </div>

        {/* Menú desplegable móvil */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 flex flex-col items-start px-6 py-4 space-y-3 text-sm font-medium md:hidden">
            <Link to="/home" onClick={() => setIsOpen(false)} className="w-full">Inicio</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="w-full">Menú</Link>
            {user && (
              <Link to="/reservas" onClick={() => setIsOpen(false)} className="w-full">Reservas</Link>
            )}
            {user?.is_staff && (
              <Link to="/gestionar-menus" onClick={() => setIsOpen(false)} className="w-full">
                Gestionar Menús
              </Link>
            )}
            { user?.is_staff && (
              <Link
                to="/admin-panel"
                onClick={() => setIsOpen(false)}
                className="w-full "
              >
                Panel Administrador
              </Link>
            )}
            <div className="w-full pt-3 border-t">
              {user ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setIsOpen(false);
                  }}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-xs"
                >
                  Cerrar sesión
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-indigo-600 hover:underline">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="text-indigo-600 hover:underline">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modal de Pedido */}
      <PedidoModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} />
    </>
  );
};

export default Navbar;
