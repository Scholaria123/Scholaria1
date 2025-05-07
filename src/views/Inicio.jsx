import { useNavigate } from "react-router-dom";
import { useAuth } from "../database/authcontext";
import './Inicio.css';
import EstudiantesImg from '../assets/imagenes/EstudiantesBoton.png';
import DocentesImg from '../assets/imagenes/DocentesBoton.png';
import AsignaturasImg from '../assets/imagenes/AsignaturasBoton.png';
import AsistenciaImg from '../assets/imagenes/AsistenciaBoton.png';
import CatalogoImg from '../assets/imagenes/CatalogoEstudiantes.png';
import EventosImg from '../assets/imagenes/EventosBoton.png';
import CalificacionesImg from '../assets/imagenes/CalificacionesBoton.png';

const Inicio = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // ✅ usamos 'user' y 'loading'
  const rol = user?.rol;

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return <p>Cargando...</p>; // 👈 Puedes personalizar esto con un spinner
  }

  return (
    <div className="inicio-container">
      <h2>Bienvenido</h2>

      <div className="botones-contenedor">
        {rol === "admin" && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/estudiantes")}>
            <div className="boton-imagen">
              <img src={EstudiantesImg} alt="Estudiantes" />
            </div>
            <p className="boton-texto">Estudiantes</p>
          </div>
        )}

        {rol === "admin" && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/Docentes")}>
            <div className="boton-imagen">
              <img src={DocentesImg} alt="Docentes" />
            </div>
            <p className="boton-texto">Docentes</p>
          </div>
        )}

        {(rol === "admin" || rol === "docente") && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/Asignatura")}>
            <div className="boton-imagen">
              <img src={AsignaturasImg} alt="Asignaturas" />
            </div>
            <p className="boton-texto">Asignaturas</p>
          </div>
        )}

        {(rol === "admin" || rol === "docente") && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/Asistencia")}>
            <div className="boton-imagen">
              <img src={AsistenciaImg} alt="Asistencia" />
            </div>
            <p className="boton-texto">Asistencia</p>
          </div>
        )}

        {(rol === "admin" || rol === "docente" || rol === "padre") && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/CatalogoCalificaciones")}>
            <div className="boton-imagen">
              <img src={CatalogoImg} alt="Catálogo de Estudiantes" />
            </div>
            <p className="boton-texto">Catálogo</p>
          </div>
        )}

        {/* Siempre visible */}
        <div className="boton-wrapper" onClick={() => handleNavigate("/Calendario")}>
          <div className="boton-imagen">
            <img src={EventosImg} alt="Calendario" />
          </div>
          <p className="boton-texto">Calendario</p>
        </div>

        {(rol === "admin" || rol === "docente" || rol === "padre" || rol === "estudiante") && (
          <div className="boton-wrapper" onClick={() => handleNavigate("/Calificaciones")}>
            <div className="boton-imagen">
              <img src={CalificacionesImg} alt="Calificaciones" />
            </div>
            <p className="boton-texto">Calificaciones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;