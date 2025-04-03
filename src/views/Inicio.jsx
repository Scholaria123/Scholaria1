import { useNavigate } from "react-router-dom";

const Inicio = () => {


  const navigate = useNavigate();

    // Función de navegación
    const handleNavigate = (path) => {
      navigate(path);
    };


    return (
      <div>
        <br />
        <br />
        <h1>Inicio</h1>
        <button onClick={() => handleNavigate("/Estudiantes")} >Ir a Estudiantes</button>
        <button onClick={() => handleNavigate("/Asignatura")} >Ir a Asignatura</button>
        <button onClick={() => handleNavigate("/Asistencia")} >Ir a Asistencia</button>
      </div>
    )
  }
  
  export default Inicio;