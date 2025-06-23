import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { FaBoxOpen, FaDollarSign, FaChartBar, FaTrophy } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ResumenVentas = () => {
  const [datos, setDatos] = useState(null);
  const [periodo, setPeriodo] = useState('dia');

  useEffect(() => {
    api.get(`/resumen-ventas/?periodo=${periodo}`)
      .then(res => setDatos(res.data))
      .catch(err => console.error('❌ Error al cargar resumen:', err));
  }, [periodo]);

  const chartData = {
    labels: datos?.mas_vendidos.map(p => p.menu__nombre),
    datasets: [
      {
        label: 'Unidades vendidas',
        data: datos?.mas_vendidos.map(p => p.cantidad),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            📊 Resumen de Ventas
          </h2>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
        </div>

        {datos ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card icon={<FaBoxOpen className="text-3xl text-indigo-600" />} title="Productos vendidos" value={datos.total_productos} />
              <Card icon={<FaChartBar className="text-3xl text-blue-600" />} title="Pedidos completados" value={datos.total_pedidos} />
              <Card icon={<FaDollarSign className="text-3xl text-green-600" />} title="Total recaudado" value={`$${datos.total_recaudado}`} />
              <Card icon={<FaTrophy className="text-3xl text-yellow-500" />} title="Top ventas" value={`${datos.mas_vendidos?.[0]?.menu__nombre || 'N/A'}`} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4">🍽️ Platos más vendidos ({periodo})</h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">Cargando resumen...</p>
        )}
      </section>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4 hover:shadow-md transition">
    {icon}
    <div>
      <h4 className="text-sm text-gray-600">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default ResumenVentas;
