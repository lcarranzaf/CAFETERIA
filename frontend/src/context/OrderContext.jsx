// src/context/OrderContext.jsx
import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [pedido, setPedido] = useState([]);
  const { authTokens } = useContext(AuthContext);

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

  const eliminarDelPedido = (id) => {
    setPedido(pedido.filter(item => item.id !== id));
  };

  const confirmarPedido = async () => {
    try {
      const items = pedido.map((item) => ({
        menu: item.id,
        cantidad: item.cantidad,
      }));

      const res = await api.post('orders/', { items }); // ✅ sin headers
      console.log('✅ Pedido confirmado:', res.data);
      setPedido([]);  // limpia el carrito
      return res.data; // devuelve el pedido creado (incluye id)
    } catch (error) {
      console.error('❌ Error al confirmar pedido:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{ pedido, agregarAlPedido, eliminarDelPedido, confirmarPedido }}
    >
      {children}
    </OrderContext.Provider>
  );
};
