// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { pedido } = useContext(OrderContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative">
      {/* Logo y título */}
      <div className="flex items-center space-x-2">
        <img src="/Logo.png" alt="Logo" className="h-10" />
        <h1 className="text-lg font-bold">BYTEBAR</h1>
      </div>

      {/* Menú horizontal para pantallas grandes */}
      <ul className="hidden md:flex space-x-6 font-medium">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/menu">Menú</Link></li>
        <li><Link to="/pedido">Pedido</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
      </ul>

      {/* Auth usuario - solo en pantallas grandes */}
      <div className="hidden md:block text-sm font-medium">
        {user ? (
          <div className="flex items-center gap-3">
            <span>👋 {user.first_name || user.username}</span>
            <button
              onClick={logoutUser}
              className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-xs"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
          </div>
        )}
      </div>

      {/* Botón menú móvil */}
      <div className="md:hidden flex items-center gap-2">
        {user && (
          <span className="pr-4">👋 {user.first_name || user.username}</span>
        )}
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          <HiOutlineMenu size={28} />
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 flex flex-col items-start px-6 py-4 space-y-3 text-sm font-medium md:hidden">
          <Link to="/" onClick={() => setIsOpen(false)} className="w-full">Inicio</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)} className="w-full">Menú</Link>
          <Link to="/pedido" onClick={() => setIsOpen(false)} className="w-full">Pedido</Link>
          <Link to="/reservas" onClick={() => setIsOpen(false)} className="w-full">Reservas</Link>

          <div className="w-full pt-3 border-t">
            {user ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    logoutUser();
                    setIsOpen(false);
                  }}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-xs"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-indigo-600 hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="text-indigo-600 hover:underline" onClick={() => setIsOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
