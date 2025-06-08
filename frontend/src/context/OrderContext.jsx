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
      const response = await api.post('orders/', {
        items: pedido.map((item) => ({
          menu: item.id,
          cantidad: item.cantidad
        }))
      }, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        }
      });

      console.log('Pedido confirmado:', response.data);
      setPedido([]);  // Limpiar carrito
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
    }
  };

  return (
    <OrderContext.Provider value={{ pedido, agregarAlPedido, eliminarDelPedido, confirmarPedido }}>
      {children}
    </OrderContext.Provider>
  );
};

const confirmarPedido = async () => {
  try {
    // Paso 1: crear la orden vacía
    const resOrden = await api.post('orders/', {});  // Asegúrate de tener autenticación activa
    const orderId = resOrden.data.id;

    // Paso 2: por cada item del carrito, crear un OrderItem
    for (const item of pedido) {
      await api.post('orders/items/', {
        order: orderId,
        menu: item.id,
        cantidad: item.cantidad,
      });
    }

    // Paso 3: limpiar el carrito
    setPedido([]);

    return orderId;  // devuelve el id de la orden creada
  } catch (error) {
    console.error('Error al confirmar pedido:', error);
    return null;
  }
};