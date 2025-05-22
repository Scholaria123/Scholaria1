import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './views/Login';
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import Estudiantes from "./components/views/Estudiantes";
import Asignaturas from "./components/views/Asignatura";
import CatalogoCalificaciones from "./components/views/CatalogoCalificacion";
import Asistencia from "./components/views/Asistencia";
import CalendarioEventos from "./components/views/CalendarioEventos";
import Calificaciones from "./components/views/Calificaciones";
import LoginDocente from "./components/LoginDocente";
import Docentes from "./components/views/Docente";
import Notificaciones from "./components/Notificaciones/Notificaciones";

import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className={`App ${user ? "with-navbar" : ""}`}>
      <Encabezado />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route 
            path="/inicio" 
            element={
              <ProtectedRoute allowedRoles={["estudiante", "docente", "admin", "padre"]}>
                <Inicio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/estudiantes" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Estudiantes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Docentes" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Docentes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Asignatura" 
            element={
              <ProtectedRoute allowedRoles={["docente", "admin"]}>
                <Asignaturas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Asistencia" 
            element={
              <ProtectedRoute allowedRoles={["docente", "admin"]}>
                <Asistencia />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/CatalogoCalificaciones" 
            element={
              <ProtectedRoute allowedRoles={["admin", "padre", "docente"]}>
                <CatalogoCalificaciones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Calendario" 
            element={
              <ProtectedRoute allowedRoles={["estudiante", "docente", "admin"]}>
                <CalendarioEventos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Calificaciones" 
            element={
              <ProtectedRoute allowedRoles={["docente", "admin", "padre", "estudiante"]}>
                <Calificaciones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Notificaciones"  
            element={
              <ProtectedRoute allowedRoles={["docente", "admin", "padre", "estudiante"]}>
                <Notificaciones />
              </ProtectedRoute>
            }
          />
          <Route path="/logindocente/:carnet" element={<LoginDocente />} />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
