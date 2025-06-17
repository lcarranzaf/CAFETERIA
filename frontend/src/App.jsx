import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home'; 
import MenuPage from './pages/MenuPage';
import PedidoPage from './pages/PedidoPage';
import ReservaPage from './pages/ReservaPage';
import CrearMenuPage from './pages/CrearMenuPage';
import GestionarMenusPage from './pages/GestionarMenusPage';
import AdminPanel from './pages/AdminPanel';
import CrearAdminPage from './pages/CrearAdminPage'
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; 
import AdminPedidosPage from './pages/AdminPedidosPage';
import ResumenVentas from './pages/ResumenVentas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas generales */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/pedido" element={<PedidoPage />} />
          <Route path="/reservas" element={<ReservaPage />} />
        </Route>

        {/* Rutas solo para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/crear-menu" element={<CrearMenuPage />} />
          <Route path="/gestionar-menus" element={<GestionarMenusPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-panel/crear-admin" element={<CrearAdminPage />} />
          <Route path="/admin-panel/pedidos" element={<AdminPedidosPage />} />
          <Route path="/admin-panel/resumen-ventas" element={<ResumenVentas />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
