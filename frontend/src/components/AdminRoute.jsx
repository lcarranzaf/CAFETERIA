
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  return user && user.is_staff ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRoute;
