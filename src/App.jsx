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


import './App.css';
import Docentes from "./components/views/Docente";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Barra de navegación */}
          <Encabezado />
          
          <main>
            <Routes>
              {/* Ruta de Login */}
              <Route path="/" element={<Login />} />

              {/* Ruta de Inicio protegida */}
              <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />

              {/* Ruta de Estudiantes protegida */}
              <Route path="/estudiantes" element={<ProtectedRoute><Estudiantes /></ProtectedRoute>} />

              {/* Ruta de Estudiantes protegida */}
              <Route path="/Docentes" element={<ProtectedRoute><Docentes /></ProtectedRoute>} />

              {/* Ruta de Asignaturas protegida */}
              <Route path="/Asignatura" element={<ProtectedRoute><Asignaturas /></ProtectedRoute>} />

              <Route path="/Asistencia" element={<ProtectedRoute><Asistencia /></ProtectedRoute>} />

              <Route path="/CatalogoCalificaciones" element={<ProtectedRoute><CatalogoCalificaciones /></ProtectedRoute>} />

              <Route path="/Calendario" element={<ProtectedRoute><CalendarioEventos /></ProtectedRoute>} />

              <Route path="/Calificaciones" element={<ProtectedRoute><Calificaciones /></ProtectedRoute>} />

              {/* Ruta de error 404 */}
              <Route path="*" element={<h1>Página no encontrada</h1>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
