import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import cafeteriaImage from '../../assets/CAFETERIA.webp';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login/', credentials);
      loginUser(response.data);
      navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black flex flex-col ">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Formulario */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-6 " >
          <div className="bg-amber-50 shadow-lg rounded-xl p-8 w-full sm:max-w-md h-fit">
            <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Usuario */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black bg-slate-300"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-300 text-black"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              {/* Botón */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-300"
              >
                INGRESAR
              </button>
            </form>
            <br></br>
            <span>
              ¿Aún no tienes una cuenta?
              <Link
              to="/register"
              className="0 text-blue-500 px-2 py-1 "
            >Registrate aquí..
            </Link>
            </span>
            
          </div>
        </div>

        {/* Imagen */}
        <div className="w-full md:w-1/2 h-48 md:h-auto">
          <img
            src={cafeteriaImage}
            alt="cafetería"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
