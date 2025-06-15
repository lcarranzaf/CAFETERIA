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


  // ✅ Guardar carrito en localStorage cada vez que cambie y haya sesión
  useEffect(() => {
    if (user) {
      localStorage.setItem('pedido', JSON.stringify(pedido));
    }
  }, [pedido, user]);

  // ✅ Agregar item al pedido
  const agregarAlPedido = (item) => {
    const index = pedido.findIndex(i => i.id === item.id);
    if (index !== -1) {
      const actualizado = [...pedido];
      actualizado[index].cantidad += 1;
      setPedido(actualizado);
    } else {
      setPedido([...pedido, { ...item, cantidad: 1 }]);
    }
  };

  // ✅ Eliminar item del pedido
  const eliminarDelPedido = (id) => {
    const actualizado = pedido.filter(item => item.id !== id);
    setPedido(actualizado);
  };

  // ✅ Actualizar cantidad (y eliminar si queda en 0)
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

  // ✅ Confirmar pedido y limpiar carrito
  const confirmarPedido = async () => {
    try {
      const items = pedido.map(item => ({
        menu: item.id,
        cantidad: item.cantidad,
      }));

      const res = await api.post('orders/', { items });
      setPedido([]);
      localStorage.removeItem('pedido'); // limpiar storage al confirmar
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
        confirmarPedido
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
