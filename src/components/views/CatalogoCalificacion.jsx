import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaCalificaciones from "../tarjetas/TarjetaCalificaciones";


const CatalogoCalificaciones = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("Todas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiantesCollection = collection(db, "estudiantes");
        const asignaturasCollection = collection(db, "asignaturas");

        const estudiantesData = await getDocs(estudiantesCollection);
        const asignaturasData = await getDocs(asignaturasCollection);

        // Mapear asignaturas en un objeto { id: { nombre, docente } }
        const asignaturasMap = {};
        asignaturasData.docs.forEach((doc) => {
          const data = doc.data();
          asignaturasMap[doc.id] = { nombre: data.nombre, docente: data.docente };
        });

        // Procesar estudiantes
        const estudiantesProcesados = estudiantesData.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            asignaturaId: Array.isArray(data.asignaturaId) ? data.asignaturaId : [],
          };
        });

        setAsignaturas(asignaturasData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setEstudiantes(estudiantesProcesados);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar estudiantes por asignatura seleccionada
  const estudiantesFiltrados =
    asignaturaSeleccionada === "Todas"
      ? estudiantes
      : estudiantes.filter((estudiante) =>
          estudiante.asignaturaId.includes(asignaturaSeleccionada)
        );

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