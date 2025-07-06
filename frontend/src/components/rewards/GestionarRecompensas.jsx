import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerRecompensas,
  eliminarRecompensa,
  actualizarRecompensa,
  cambiarEstadoRecompensa,
} from "../../services/recompensasService";
import Navbar from "../layout/Navbar";
import { HiPlus, HiTrash, HiPencil } from "react-icons/hi2";
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';

const GestionarRecompensas = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [formEditado, setFormEditado] = useState({});

  const token = JSON.parse(localStorage.getItem("authTokens"))?.access;

  const cargarRecompensas = async () => {
    try {
      const data = await obtenerRecompensas(token, true); // `true` para incluir inactivas
      setRecompensas(data);
    } catch (err) {
      console.error("Error al obtener recompensas", err);
    }
  };

  useEffect(() => {
    cargarRecompensas();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta recompensa?")) return;
    await eliminarRecompensa(id, token);
    cargarRecompensas();
  };

  const toggleEstado = async (recompensa) => {
    try {
      await cambiarEstadoRecompensa(recompensa.id, !recompensa.activo, token);
      cargarRecompensas();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  };

  const handleEditChange = (e) => {
    setFormEditado({ ...formEditado, [e.target.name]: e.target.value });
  };

  const guardarEdicion = async (id) => {
    await actualizarRecompensa(id, formEditado, token);
    setModoEdicion(null);
    setFormEditado({});
    cargarRecompensas();
  };

  return (
    <>
      <Navbar />
      <div className=" px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Recompensas</h2>
          <Link
            to="/admin-panel/recompensas/nueva"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
          >
            <HiPlus />
            Crear
          </Link>
        </div>

        <div className="space-y-4">
          {recompensas.map((r) => (
            <div
              key={r.id}
              className="border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center"
            >
              {modoEdicion === r.id ? (
                <div className="w-full space-y-2">
                  <input
                    name="nombre"
                    value={formEditado.nombre || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Nombre"
                  />
                  <textarea
                    name="descripcion"
                    value={formEditado.descripcion || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Descripción"
                  />
                  <input
                    name="estrellas_requeridas"
                    type="number"
                    min="1"
                    value={formEditado.estrellas_requeridas || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Estrellas requeridas"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarEdicion(r.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setModoEdicion(null)}
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{r.nombre}</h3>
                    <p className="text-sm text-gray-600">{r.descripcion}</p>
                    <p className="text-sm text-gray-500">
                      ⭐ Requiere: {r.estrellas_requeridas}
                    </p>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        r.activo ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {r.activo ? "Activa" : "Inactiva"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setModoEdicion(r.id) || setFormEditado(r)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <HiPencil size={20} />
                    </button>
                    <button
                      onClick={() => toggleEstado(r)}
                      className={`${
                        r.activo ? "text-yellow-600" : "text-green-600"
                      } hover:text-opacity-80`}
                      title={r.activo ? "Desactivar" : "Activar"}
                    >
                      {r.activo ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                    <button
                      onClick={() => handleEliminar(r.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <HiTrash size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GestionarRecompensas;
