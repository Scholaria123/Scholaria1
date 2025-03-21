import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../database/authcontext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Si el usuario está autenticado, se renderiza el contenido hijo, de lo contrario se redirige al login
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
