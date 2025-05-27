import { useNavigate } from "react-router-dom";
import { useAuth } from "../database/authcontext";
import { useEffect, useState } from "react";
import './Inicio.css';
import EstudiantesImg from '../assets/imagenes/EstudiantesBoton.png';
import DocentesImg from '../assets/imagenes/DocentesBoton.png';
import AsignaturasImg from '../assets/imagenes/AsignaturasBoton.png';
import AsistenciaImg from '../assets/imagenes/AsistenciaBoton.png';
import EventosImg from '../assets/imagenes/EventosBoton.png';
import CalificacionesImg from '../assets/imagenes/CalificacionesBoton.png';
import LoaderGif from '../assets/loader.gif';

const Inicio = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowLoader(false);
  }, 1000); 

  return () => clearTimeout(timer);
}, []);

if (loading || showLoader || !user) {
return (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#0c0453", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <img src={LoaderGif} alt="Cargando..." style={{ width: "150px" }} />
  </div>
);
}

  const rol = user?.rol;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="inicio-container">
      <h2>Bienvenido a Scholaria</h2>

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

      {(rol === "admin" || rol === "docente") && (
        <div className="estadisticas-boton" style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => handleNavigate("/estadisticas")}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}
          >
            Ver Estadísticas Generales
          </button>
        </div>
      )}
    </div>
  );
};

export default Inicio;
