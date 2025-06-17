// src/pages/AdminPanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HiChartBar, HiTrophy } from 'react-icons/hi2';
import { HiClipboardList, HiUserAdd } from 'react-icons/hi';
import Navbar from '../components/Navbar'; // ✅ Asegúrate que la ruta sea correcta

const options = [
  {
    title: 'Crear Administrador',
    description: 'Registrar un nuevo usuario con rol administrador.',
    icon: <HiUserAdd className="text-3xl text-indigo-600" />,
    link: '/admin-panel/crear-admin',
  },
  {
    title: 'Ver Pedidos',
    description: 'Revisar pedidos, ver comprobantes y cambiar su estado.',
    icon: <HiClipboardList className="text-3xl text-green-600" />,
    link: '/admin-panel/pedidos',
  },
  {
    title: 'Recompensas',
    description: 'Gestionar las recompensas para los usuarios.',
    icon: <HiTrophy className="text-3xl text-yellow-500" />,
    link: '/admin-panel/reservas',
  },
  {
    title: 'Resumen de Ventas',
    description: 'Ver productos vendidos y total recaudado hoy.',
    icon: <HiChartBar className="text-3xl text-yellow-600" />,
    link: '/admin-panel/resumen-ventas',
  },
];

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* ✅ Navbar agregado */}

      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Panel Administrador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {options.map((op, index) => (
            <Link
              key={index}
              to={op.link}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border transition flex gap-4 items-start"
            >
              {op.icon}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{op.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{op.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
