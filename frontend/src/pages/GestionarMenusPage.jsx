import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import EditarMenuModal from '../components/EditarMenuModal';

const tipos = ['desayuno', 'almuerzo', 'piqueo', 'bebida'];

const GestionarMenusPage = () => {
  const { user, authTokens } = useContext(AuthContext);

  const [menus, setMenus] = useState([]);
  const [modo, setModo] = useState('crear');
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'desayuno',
    imagen: null,
    disponible: true,
  });

  useEffect(() => {
    if (!user?.is_staff) return;
    api.get('menus/').then((res) => setMenus(res.data));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'imagen') {
      setForm({ ...form, imagen: files[0] });
    } else if (name === 'precio') {
      if (parseFloat(value) >= 0 || value === '') {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEditClick = (menu) => {
    setEditandoId(menu.id);
    setForm({
      nombre: menu.nombre,
      descripcion: menu.descripcion,
      precio: menu.precio,
      tipo: menu.tipo,
      imagen: null,
      disponible: menu.disponible,
    });
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.is_staff) return;

    if (!form.precio || parseFloat(form.precio) <= 0 || isNaN(parseFloat(form.precio))) {
      alert('❌ El precio debe ser mayor a 0');
      return;
    }

    if (modo === 'crear' && !form.imagen) {
      alert('Debes seleccionar una imagen antes de enviar.');
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('precio', form.precio);
      formData.append('tipo', form.tipo);
      formData.append('disponible', form.disponible);
      if (form.imagen) formData.append('imagen', form.imagen);

      if (modo === 'crear') {
        await api.post('menus/', formData, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('✅ Menú creado correctamente');
      } else {
        await api.put(`menus/${editandoId}/`, formData, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('✏️ Menú actualizado correctamente');
        setModalAbierto(false);
      }

      // Reset
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo: 'desayuno',
        imagen: null,
        disponible: true,
      });
      setEditandoId(null);
      setModo('crear');

      const res = await api.get('menus/');
      setMenus(res.data);
    } catch (err) {
      console.error('Error creando o editando menú:', err);
      alert('❌ Error al guardar el menú');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      <section className="py-10 px-4 md:px-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Gestionar Menús</h2>

        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => setModo('crear')} className={`px-4 py-2 rounded ${modo === 'crear' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
            Crear Menú
          </button>
          <button onClick={() => setModo('editar')} className={`px-4 py-2 rounded ${modo === 'editar' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
            Editar Menú
          </button>
        </div>

        {modo === 'crear' && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6 mb-8">
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border px-4 py-2 rounded bg-gray-300" placeholder="Nombre" />
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className="w-full border px-4 py-2 rounded bg-gray-300" placeholder="Descripción"></textarea>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} required min="0.01" step="0.01" className="w-full border bg-gray-300 px-4 py-2 rounded" placeholder="Precio" />
            <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border px-4 py-2 rounded bg-gray-300">
              {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
            <input type="file" name="imagen" onChange={handleChange} className="w-full" accept="image/*" required />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} />
              <label htmlFor="disponible">¿Disponible?</label>
            </div>
            <button type="submit" disabled={subiendo} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              {subiendo ? 'Subiendo...' : 'Crear Menú'}
            </button>
          </form>
        )}

        {modo === 'editar' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menus.map((menu) => (
              <div key={menu.id} className="bg-white p-4 rounded shadow text-center">
                <img src={menu.imagen || '/plato.png'} alt={menu.nombre} className="w-full h-28 object-cover rounded" />
                <h3 className="font-bold mt-2">{menu.nombre}</h3>
                <p className="text-sm text-gray-600">{menu.descripcion}</p>
                <p className="text-indigo-500 font-semibold">${menu.precio}</p>
                <button
                  onClick={() => handleEditClick(menu)}
                  className="mt-2 bg-yellow-500 text-white py-1 px-3 rounded-full text-sm hover:bg-yellow-600 transition"
                >
                  ✏️ Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalAbierto && (
        <EditarMenuModal
          form={form}
          onChange={handleChange}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default GestionarMenusPage;
