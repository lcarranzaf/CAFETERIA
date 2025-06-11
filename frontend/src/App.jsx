import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home'; // 👈 Importa Home
import MenuPage from './pages/MenuPage';
import PedidoPage from './pages/PedidoPage';
import ReservaPage from './pages/ReservaPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/pedido" element={<PedidoPage />} />
        <Route path="/reservas" element={<ReservaPage />} />
        {/* Redirección por defecto si no hay match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
