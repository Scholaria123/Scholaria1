import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from './views/Login';
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import Estudiantes from "./components/views/Estudiantes"  // Asegúrate de que esté en la carpeta correcta
import Asignaturas from "./components/views/Asignatura";  // Se corrigió la importación
import CatalogoCalificaciones from "./components/views/CatalogoCalificacion";
import Asistencia from "./components/views/Asistencia";
import CalendarioEventos from "./components/views/CalendarioEventos";
import Calificaciones from "./components/views/Calificaciones";
import SeleccionLogin from "./components/SeleccionLogin";
import LoginDocente from "./components/LoginDocente";
import './App.css';
import Docentes from "./components/views/Docente";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Encabezado />
          <main>
            <Routes>
              {/* Ruta de Login */}
              <Route path="/" element={<SeleccionLogin />} />
              

              {/* Rutas protegidas */}
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
                  <ProtectedRoute allowedRoles={["estudiante", "docente", "padre", "admin"]}>
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
              
              <Route path="/login" element={<Login />} />
              
              <Route path="/login-docente" element={<LoginDocente />} />


              {/* Página no encontrada */}
              <Route path="*" element={<h1>Página no encontrada</h1>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;