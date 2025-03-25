import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaEstudiante from "../tarjetas/TarjetaEstudiante";

const CatalogoEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [grados, setGrados] = useState([]);
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("Todas");
    const [gradoSeleccionado, setGradoSeleccionado] = useState("Todos");
  
    const estudiantesCollection = collection(db, "estudiantes");
    const asignaturasCollection = collection(db, "asignaturas");
  
    const fetchData = async () => {
      try {
        // Obtener estudiantes
        const estudiantesData = await getDocs(estudiantesCollection);
        const fetchedEstudiantes = estudiantesData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        
        // Obtener asignaturas
        const asignaturasData = await getDocs(asignaturasCollection);
        const fetchedAsignaturas = asignaturasData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAsignaturas(fetchedAsignaturas);
        
        // Reemplazar IDs de asignaturas con nombres y asegurar que la nota esté presente
        const estudiantesConNombres = fetchedEstudiantes.map(est => {
          const asignaturaEncontrada = fetchedAsignaturas.find(a => a.id === est.asignatura);
          return { 
            ...est, 
            asignatura: asignaturaEncontrada ? asignaturaEncontrada.nombre : "Desconocida",
            nota: est.nota || "N/A"
          };
        });
        
        setEstudiantes(estudiantesConNombres);
  
        // Obtener grados únicos
        const uniqueGrados = [...new Set(estudiantesConNombres.map(est => est.grado))];
        setGrados(uniqueGrados);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // Filtrar estudiantes por asignatura y grado
    const estudiantesFiltrados = estudiantes.filter(estudiante => {
      return (asignaturaSeleccionada === "Todas" || estudiante.asignatura === asignaturaSeleccionada) &&
             (gradoSeleccionado === "Todos" || estudiante.grado === gradoSeleccionado);
    });
  
    return (
      <Container className="mt-5">
        <br />
        <h4>Catálogo de Estudiantes</h4>
        {/* Filtro de asignaturas y grados */}
        <Row>
          <Col lg={3} md={3} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Filtrar por asignatura:</Form.Label>
              <Form.Select
                value={asignaturaSeleccionada}
                onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
              >
                <option value="Todas">Todas</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura.id} value={asignatura.nombre}>
                    {asignatura.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={3} md={3} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Filtrar por grado:</Form.Label>
              <Form.Select
                value={gradoSeleccionado}
                onChange={(e) => setGradoSeleccionado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                {grados.map((grado, index) => (
                  <option key={index} value={grado}>
                    {grado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
  
        {/* Lista de estudiantes filtrados */}
        <Row>
          {estudiantesFiltrados.length > 0 ? (
            estudiantesFiltrados.map((estudiante) => (
              <TarjetaEstudiante key={estudiante.id} estudiante={estudiante} />
            ))
          ) : (
            <p>No hay estudiantes en esta categoría.</p>
          )}
        </Row>
      </Container>
    );
  };
  
  export default CatalogoEstudiantes;
