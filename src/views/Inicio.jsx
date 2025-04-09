import { useNavigate } from "react-router-dom";
import './Inicio.css';

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
          <img src="src/assets/imagenes/EstudiantesBoton.png" alt="Estudiantes" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Docentes")}>
          <img src="src/assets/imagenes/DocentesBoton.png" alt="Docentes" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Asignatura")}>
          <img src="src/assets/imagenes/EventosBoton.png" alt="Asignaturas" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Asistencia")}>
          <img src="src/assets/imagenes/AsistenciaBoton.png" alt="Asistencia" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/CatalogoCalificaciones")}>
          <img src="src/assets/imagenes/CalificacionesBoton.png" alt="Catálogo de Calificaciones" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Calendario")}>
          <img src="src/assets/imagenes/EventosBoton.png" alt="Calendario" />
        </div>

        <div className="boton-imagen" onClick={() => handleNavigate("/Calificaciones")}>
          <img src="src/assets/imagenes/EventosBoton.png" alt="Calificaciones" />
        </div>
      </div>
    </div>
  );
};

export default Inicio;
