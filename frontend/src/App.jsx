import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import PedidoPage from './pages/PedidoPage';
import ReservaPage from './pages/ReservaPage';
import CrearMenuPage from './pages/CrearMenuPage';
import GestionarMenusPage from './pages/GestionarMenusPage';
import AdminPanel from './pages/AdminPanel';
import CrearAdminPage from './pages/CrearAdminPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminPedidosPage from './pages/AdminPedidosPage';
import ResumenVentas from './pages/ResumenVentas';
import Toast from './components/Toast';
import RecompensasList from './components/rewards/RecompensasList';
import CrearRecompensa from './components/rewards/CrearRecompensa';
import HistorialRecompensas from './components/rewards/HistorialRecompensas';
import GestionarRecompensas from './components/rewards/GestionarRecompensas';
import NotificacionesPage from './pages/NotificacionesPage';
import Footer from './components/layout/Footer';
import PerfilPage from './pages/PerfilPage';
import AcercaDesarrolladores from "./pages/AcercaDesarrolladores"

function AppContent() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <main className="flex-grow">
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
            <Route path="/recompensas" element={<RecompensasList />} />
            <Route path="/historial-recompensas" element={<HistorialRecompensas />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/acerca-desarrolladores" element={<AcercaDesarrolladores />} />
          </Route>

          {/* Rutas solo para administradores */}
          <Route element={<AdminRoute />}>
            <Route path="/crear-menu" element={<CrearMenuPage />} />
            <Route path="/gestionar-menus" element={<GestionarMenusPage />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/admin-panel/crear-admin" element={<CrearAdminPage />} />
            <Route path="/admin-panel/pedidos" element={<AdminPedidosPage />} />
            <Route path="/admin-panel/resumen-ventas" element={<ResumenVentas />} />
            <Route path="/admin-panel/recompensas/nueva" element={<CrearRecompensa />} />
            <Route path="/gestionar-recompensas" element={<GestionarRecompensas />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Footer oculto en login y register */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}

      <Toast message={toastMessage} show={toastVisible} type={toastType} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
