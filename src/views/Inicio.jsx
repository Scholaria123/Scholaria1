import { useNavigate } from "react-router-dom";
import './Inicio.css';

// ✅ Importación de imágenes como módulos
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
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Bienvenido</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="boton-imagen" onClick={() => handleNavigate("/estudiantes")}>
          <img src={EstudiantesImg} alt="Estudiantes" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Docentes")}>
          <img src={DocentesImg} alt="Docentes" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Asignatura")}>
          <img src={AsignaturasImg} alt="Asignaturas" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Asistencia")}>
          <img src={AsistenciaImg} alt="Asistencia" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/CatalogoCalificaciones")}>
          <img src={CatalogoImg} alt="Catálogo de Calificaciones" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Calendario")}>
          <img src={EventosImg} alt="Calendario" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Calificaciones")}>
          <img src={CalificacionesImg} alt="Calificaciones" />
        </div>
      </div>
    </div>
  );
};

export default Inicio;
