// src/context/OrderContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [pedido, setPedido] = useState(() => {
    const almacenado = localStorage.getItem('pedido');
    return almacenado ? JSON.parse(almacenado) : [];
  });

  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    const handleLogout = () => {
      setPedido([]);
      localStorage.removeItem('pedido');
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pedido', JSON.stringify(pedido));
    }
  }, [pedido, user]);

  const agregarAlPedido = (item) => {
    const index = pedido.findIndex(i => i.id === item.id);
    if (index !== -1) {
      const actualizado = [...pedido];
      if (actualizado[index].cantidad < actualizado[index].stock) {
        actualizado[index].cantidad += 1;
        setPedido(actualizado);
      }
    } else {
      setPedido([...pedido, {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        stock: item.stock, // 👈 Nos aseguramos de incluir el stock
        cantidad: 1,
      }]);
    }
  };

  const limpiarPedido = () => {
    setPedido([]);
    localStorage.removeItem('pedido');
  };

  const eliminarDelPedido = (id) => {
    const actualizado = pedido.filter(item => item.id !== id);
    setPedido(actualizado);
  };

  const actualizarCantidadPedido = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelPedido(id);
      return;
    }

    const actualizado = pedido.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setPedido(actualizado);
  };

  const confirmarPedido = async () => {
    try {
      const items = pedido.map(item => ({
        menu: item.id,
        cantidad: item.cantidad,
      }));

      const res = await api.post('orders/', { items });
      setPedido([]);
      localStorage.removeItem('pedido');
      return res.data;
    } catch (error) {
      console.error('❌ Error al confirmar pedido:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        pedido,
        agregarAlPedido,
        eliminarDelPedido,
        actualizarCantidadPedido,
        confirmarPedido,
        limpiarPedido
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
