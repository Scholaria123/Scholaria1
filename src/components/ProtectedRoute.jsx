import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../database/authcontext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // puedes reemplazar con un spinner si quieres

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;
