import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaCalificaciones from "../tarjetas/TarjetaCalificaciones";
import "./CatalogoCalificaciones.css";

const CatalogoCalificaciones = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiantesCollection = collection(db, "estudiantes");
        const asignaturasCollection = collection(db, "asignaturas");

        const estudiantesData = await getDocs(estudiantesCollection);
        const asignaturasData = await getDocs(asignaturasCollection);

        const estudiantesProcesados = estudiantesData.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            asignaturaId: Array.isArray(data.asignaturaId) ? data.asignaturaId : [],
          };
        });

        setAsignaturas(
          asignaturasData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setEstudiantes(estudiantesProcesados);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const coincideAsignatura =
      asignaturaSeleccionada === "Todas" ||
      estudiante.asignaturaId.includes(asignaturaSeleccionada);

    const terminoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda =
      estudiante.nombre?.toLowerCase().includes(terminoBusqueda) ||
      estudiante.apellido?.toLowerCase().includes(terminoBusqueda) ||
      estudiante.grado?.toLowerCase().includes(terminoBusqueda) ||
      estudiante.seccion?.toLowerCase().includes(terminoBusqueda);

    return coincideAsignatura && coincideBusqueda;
  });

  return (
<Container className="catalogo-container">
  <h4>Catálogo de Estudiantes</h4>
  <div className="filtros-wrapper">
    <Form.Group className="form-group">
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

    <Form.Group className="form-group">
      <Form.Label>Buscar estudiante:</Form.Label>
      <Form.Control
        type="text"
        placeholder="Nombre, apellido, grado o sección"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </Form.Group>
  </div>

  <Row className="tarjetas-row">
    {estudiantesFiltrados.length > 0 ? (
      estudiantesFiltrados.map((estudiante) => (
        <TarjetaCalificaciones key={estudiante.id} estudiante={estudiante} />
      ))
    ) : (
      <p>No hay estudiantes que coincidan con la búsqueda.</p>
    )}
  </Row>
</Container>
  );
};

export default CatalogoCalificaciones;
