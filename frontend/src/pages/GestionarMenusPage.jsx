"use client";

import { useState, useEffect, useContext } from "react";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import EditarMenuModal from "../components/EditarMenuModal";
import Toast from "../components/Toast";

const tipos = ["desayuno", "almuerzo", "piqueo", "bebida"];

const GestionarMenusPage = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const [modo, setModo] = useState("crear");
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    tipo: "desayuno",
    imagen: null,
    disponible: true,
    stock: "",
  });
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    tipo: "desayuno",
    imagen: null,
    disponible: true,
    stock: "",
  });
  const [preview, setPreview] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2600);
  };

  useEffect(() => {
    if (!user?.is_staff) return;
    api.get("menus/").then((res) => setMenus(res.data));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "imagen") {
      const file = files[0];
      if (file) {
        setForm({ ...form, imagen: file });
        setPreview(URL.createObjectURL(file));
      }
    } else if (name === "precio" || name === "stock") {
      if ((Number.parseFloat(value) >= 0 && value !== "") || value === "") {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      setEditForm({ ...editForm, [name]: checked });
    } else if (name === "imagen") {
      const file = files[0];
      if (file) {
        setEditForm({ ...editForm, imagen: file });
        setEditPreview(URL.createObjectURL(file));
      }
    } else if (name === "precio" || name === "stock") {
      if ((Number.parseFloat(value) >= 0 && value !== "") || value === "") {
        setEditForm({ ...editForm, [name]: value });
      }
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, imagen: null });
    setPreview(null);
  };

  const handleEditClick = (menu) => {
    setEditandoId(menu.id);
    // Solo llenar el formulario de edición, no el principal
    setEditForm({
      nombre: menu.nombre,
      descripcion: menu.descripcion,
      precio: menu.precio,
      tipo: menu.tipo,
      imagen: menu.imagen || "",
      disponible: menu.disponible,
      stock: menu.stock || "",
    });
    setEditPreview(menu.imagen || null);
    setModalAbierto(true);
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      tipo: "desayuno",
      imagen: null,
      disponible: true,
      stock: "",
    });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.is_staff) return;

    if (
      !form.precio ||
      Number.parseFloat(form.precio) <= 0 ||
      isNaN(Number.parseFloat(form.precio))
    ) {
      showToast("❌ El precio debe ser mayor a 0", "warning");
      return;
    }

    if (
      !form.stock ||
      Number.parseInt(form.stock) < 0 ||
      isNaN(Number.parseInt(form.stock))
    ) {
      showToast(
        "❌ El stock debe ser un número válido mayor o igual a 0",
        "warning"
      );
      return;
    }

    if (!form.imagen) {
      showToast("Debes seleccionar una imagen antes de enviar.", "warning");
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("precio", form.precio);
      formData.append("tipo", form.tipo);
      formData.append("disponible", form.disponible);
      formData.append("stock", form.stock);

      if (form.imagen instanceof File) {
        formData.append("imagen", form.imagen);
      }

      await api.post("menus/", formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("✅ Menú creado correctamente", "success");
      limpiarFormulario(); // Limpiar formulario después de crear

      const res = await api.get("menus/");
      setMenus(res.data);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        if (data.nombre && Array.isArray(data.nombre)) {
          showToast(`❌ ${data.nombre[0]}`, "error");
        } else {
          const firstKey = Object.keys(data)[0];
          const firstError = Array.isArray(data[firstKey])
            ? data[firstKey][0]
            : data[firstKey];
          showToast(`❌ ${firstError}`, "error");
        }
      } else if (data?.detail) {
        showToast(`❌ ${data.detail}`, "error");
      } else {
        showToast("❌ Error al guardar el menú", "error");
      }
      if (!data?.nombre) {
        console.error("Error creando menú:", err);
      }
    } finally {
      setSubiendo(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.is_staff) return;

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("nombre", editForm.nombre);
      formData.append("descripcion", editForm.descripcion);
      formData.append("precio", editForm.precio);
      formData.append("tipo", editForm.tipo);
      formData.append("disponible", editForm.disponible);
      formData.append("stock", editForm.stock);

      if (editForm.imagen instanceof File) {
        formData.append("imagen", editForm.imagen);
      }

      await api.put(`menus/${editandoId}/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("✏️ Menú actualizado correctamente", "success");
      setModalAbierto(false);
      setEditandoId(null);

      const res = await api.get("menus/");
      setMenus(res.data);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        if (data.nombre && Array.isArray(data.nombre)) {
          showToast(`❌ ${data.nombre[0]}`, "error");
        } else {
          const firstKey = Object.keys(data)[0];
          const firstError = Array.isArray(data[firstKey])
            ? data[firstKey][0]
            : data[firstKey];
          showToast(`❌ ${firstError}`, "error");
        }
      } else if (data?.detail) {
        showToast(`❌ ${data.detail}`, "error");
      } else {
        showToast("❌ Error al actualizar el menú", "error");
      }
      console.error("Error editando menú:", err);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className=" border-blacktext-4xl font-bold text-gray-800 mb-2">
            Gestionar Menú
          </h2>
        </div>

        {/* Botones de navegación mejorados */}
        <div className="flex justify-center mb-8 bg-white ">
          <div className="bg-white rounded-lg p-1 shadow-lg ">
            <button
              onClick={() => setModo("crear")}
              className={`px-6 py-3 rounded-md border-black bg-white font-bold transition-all ${
                modo === "crear"
                  ? "bg-orange-300 text-black shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              ➕ Agregar Plato
            </button>
            <button
              onClick={() => setModo("editar")}
              className={`px-6 py-3 border-black rounded-md font-extraboldtransition-all bg-white ${
                modo === "editar"
                  ? "bg-orange-300 text-black shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📋 Administrar Platos
            </button>
          </div>
        </div>
        {modo === "crear" && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-black">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Agregar Nuevo Plato
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl capitalize   font-medium text-gray-700 mb-2">
                    Nombre del plato
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full text-black border-2 bg-gray-50 border-gray-800 px-4 py-3 rounded-lg "
                    placeholder="Ej: Hamburguesa Clásica"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full text-black border-2 bg-gray-50 border-gray-800 px-4 py-3 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full text-black border-2 bg-gray-50 border-gray-800 px-4 py-3 rounded-lg"
                  placeholder="Describe los ingredientes y características..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full border-2 text-black bg-gray-50 border-gray-800 px-4 py-3 rounded-lg"
                  >
                    {tipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700  mb-2">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                    className="w-full border-2 bg-gray-50 border-gray-800 text-black px-4 py-3 rounded-lg"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  Imagen del plato
                </label>
                {!preview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors bg-gray-50">
                    <div className="text-6xl text-gray-400 mb-4">📷</div>
                    <label htmlFor="imagen" className="cursor-pointer">
                      <span className="text-green-600 font-medium hover:text-green-700">
                        Haz clic para subir una imagen
                      </span>
                    </label>
                    <input
                      id="imagen"
                      name="imagen"
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                      accept="image/*"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="w-full h-48 object-contain rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="disponible"
                  name="disponible"
                  checked={form.disponible}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label
                  htmlFor="disponible"
                  className="text-gray-700 font-medium"
                >
                  ¿Disponible para la venta?
                </label>
              </div>

              <button
                type="submit"
                disabled={subiendo}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {subiendo ? "⏳ Agregando..." : "✅ Agregar Plato"}
              </button>
            </form>
          </div>
        )}
        {modo === "editar" && (
          <div className="bg-white rounded-xl border  border-black shadow-lg p-6">
            <h3 className="text-2xl font-bold  text-gray-800 mb-6 text-center">
              Platos Existentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6   ">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white border-2  border-black rounded-xl p-4 hover:shadow-lg transition-all duration-300 "
                >
                  <div className="relative mb-4">
                    <img
                      src={menu.imagen || "/plato.png"}
                      alt={menu.nombre}
                      className="w-full h-40 object-contain rounded-lg"
                    />
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {menu.tipo}
                    </span>
                  </div>
                  <h4 className="font-bold capitalize text-2xl text-gray-800 mb-2">
                    {menu.nombre}
                  </h4>
                  <p className="text-gray-600 text-xl mb-3 line-clamp-2">
                    {menu.descripcion}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-green-600">
                      $ {menu.precio}
                    </span>
                    <span className=" text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Stock: {menu.stock}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditClick(menu)}
                    className="w-full bg-orange-400 text-black py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                  >
                    ✏️ Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalAbierto && (
        <EditarMenuModal
          form={editForm}
          onChange={handleEditChange}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleEditSubmit}
          preview={editPreview}
          setPreview={setEditPreview}
        />
      )}

      {toast.show && (
        <Toast message={toast.message} show={toast.show} type={toast.type} />
      )}
    </div>
  );
};

export default GestionarMenusPage;
