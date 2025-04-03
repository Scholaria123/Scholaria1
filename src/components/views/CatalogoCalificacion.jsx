import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaCalificaciones from "../tarjetas/TarjetaCalificaciones";

const CatalogoCalificaciones = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("Todas");
  
    const estudiantesCollection = collection(db, "estudiantes");
    const asignaturasCollection = collection(db, "asignaturas");
  
    const fetchData = async () => {
        try {
          const estudiantesCollection = collection(db, "estudiantes");
          const asignaturasCollection = collection(db, "asignaturas");
    
          const estudiantesData = await getDocs(estudiantesCollection);
          const fetchedEstudiantes = estudiantesData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
    
          const asignaturasData = await getDocs(asignaturasCollection);
          const asignaturasMap = {};
    
          const asignaturasLista = asignaturasData.docs.map((doc) => {
            const data = doc.data();
            asignaturasMap[doc.id] = { nombre: data.nombre, docente: data.docente };
            return { id: doc.id, nombre: data.nombre, docente: data.docente };
          });
    
          console.log("📌 Asignaturas obtenidas:", asignaturasLista);
    
          const estudiantesConAsignatura = fetchedEstudiantes.map((estudiante) => ({
            ...estudiante,
            asignaturaNombre: asignaturasMap[estudiante.asignaturaId]?.nombre || "Desconocido",
            docente: asignaturasMap[estudiante.asignaturaId]?.docente || "Desconocido",
          }));
    
          setAsignaturas(asignaturasLista);
          setEstudiantes(estudiantesConAsignatura);
        } catch (error) {
          console.error("❌ Error al obtener datos:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
  
    // Filtrar estudiantes por asignatura seleccionada
    const estudiantesFiltrados =
      asignaturaSeleccionada === "Todas"
        ? estudiantes
        : estudiantes.filter((estudiante) => estudiante.asignaturaId === asignaturaSeleccionada);
  
    return (
      <Container className="mt-5">
        <h4>Catálogo de Asignatura</h4>
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
                  <option key={asignatura.id} value={asignatura.id}>
                    {asignatura.nombre} - {asignatura.docente}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {estudiantesFiltrados.length > 0 ? (
            estudiantesFiltrados.map((estudiante) => (
              <TarjetaCalificaciones key={estudiante.id} estudiante={estudiante} />
            ))
          ) : (
            <p>No hay estudiantes en esta asignatura.</p>
          )}
        </Row>
      </Container>
    );
  };
  
  export default CatalogoCalificaciones;