import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from './views/Login'
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import Estudiantes from "./components/views/estudiantes";

import './App.css'

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <div className="App">
            <Encabezado />
            <main>
              <Routes>
                {/* Ruta de Login */}
                <Route path="/" element={<Login />} />

                {/* Ruta de Inicio protegida */}
                <Route path="/Inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />

                {/* Ruta de Estudiantes protegida */}
                <Route path="/Estudiantes" element={<ProtectedRoute><Estudiantes /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App;
