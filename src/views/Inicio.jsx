import { useNavigate } from "react-router-dom";
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

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="inicio-container">
      <h2>Bienvenido</h2>

      <div className="botones-contenedor">
        <div className="boton-wrapper" onClick={() => handleNavigate("/estudiantes")}>
          <div className="boton-imagen">
            <img src={EstudiantesImg} alt="Estudiantes" />
          </div>
          <p className="boton-texto">Estudiantes</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/Docentes")}>
          <div className="boton-imagen">
            <img src={DocentesImg} alt="Docentes" />
          </div>
          <p className="boton-texto">Docentes</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/Asignatura")}>
          <div className="boton-imagen">
            <img src={AsignaturasImg} alt="Asignaturas" />
          </div>
          <p className="boton-texto">Asignaturas</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/Asistencia")}>
          <div className="boton-imagen">
            <img src={AsistenciaImg} alt="Asistencia" />
          </div>
          <p className="boton-texto">Asistencia</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/CatalogoCalificaciones")}>
          <div className="boton-imagen">
            <img src={CatalogoImg} alt="Catálogo de Estudiantes" />
          </div>
          <p className="boton-texto">Catálogo</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/Calendario")}>
          <div className="boton-imagen">
            <img src={EventosImg} alt="Calendario" />
          </div>
          <p className="boton-texto">Calendario</p>
        </div>

        <div className="boton-wrapper" onClick={() => handleNavigate("/Calificaciones")}>
          <div className="boton-imagen">
            <img src={CalificacionesImg} alt="Calificaciones" />
          </div>
          <p className="boton-texto">Calificaciones</p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
