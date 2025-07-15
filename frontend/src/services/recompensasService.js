import axios from 'axios';

const API = 'http://localhost:8000/api';

export const obtenerRecompensas = async (token, includeAll = false) => {
  const res = await axios.get(`${API}/recompensas/?todas=${includeAll}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const crearRecompensa = async (data, token) => {
  const res = await axios.post(`${API}/recompensas/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const actualizarRecompensa = async (id, data, token) => {
  const res = await axios.put(`${API}/recompensas/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const eliminarRecompensa = async (id, token) => {
  const res = await axios.delete(`${API}/recompensas/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const canjearRecompensa = async (id, token) => {
  const res = await axios.post(
    `${API}/recompensas/${id}/canjear/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const obtenerHistorialCanjes = async (token) => {
  const res = await axios.get(`${API}/recompensas/historial/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const obtenerHistorialTodos = async (token) => {
  const res = await axios.get(`${API}/recompensas/historial-todos/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const obtenerRecompensasPorUsuario = async (usuarioId, token) => {
  const res = await axios.get(`${API}/recompensas/usuario/${usuarioId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const cambiarEstadoRecompensa = async (id, nuevoEstado, token) => {
  const res = await axios.patch(
    `${API}/recompensas/${id}/`,
    { activo: nuevoEstado },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};