// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { pedido } = useContext(OrderContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <h1 className="text-lg font-bold">BYTEBAR</h1>
      </div>

      <ul className="hidden md:flex space-x-6 font-medium">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/menu">Menú</Link></li> 
        <li><Link to="/pedido">Pedido</Link></li>
        <li><a href="#">Recompensas</a></li>
        <li><a href="#">Reservas</a></li>
      </ul>
      <div className="text-sm font-medium">
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
    </nav>
  );
};

export default Navbar;
