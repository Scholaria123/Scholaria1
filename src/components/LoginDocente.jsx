// components/LoginDocente.jsx
import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LoginDocente = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [infoAsignatura, setInfoAsignatura] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "docentes"),
        where("nombre", "==", nombre)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Docente no encontrado.");
        return;
      }

      const docenteData = snapshot.docs[0].data();
      const asignaturaId = docenteData.asignaturaId;

      const asignaturaDoc = await getDoc(doc(db, "asignaturas", asignaturaId));
      const asignatura = asignaturaDoc.data();
      setInfoAsignatura(asignatura);

      const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
      const estudiantesFiltrados = estudiantesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((est) => est.asignaturaId?.includes(asignaturaId));

      setEstudiantes(estudiantesFiltrados);

      const calificacionesSnapshot = await getDocs(
        query(
          collection(db, "calificaciones"),
          where("asignaturaId", "==", asignaturaId)
        )
      );
      const calificacionesData = calificacionesSnapshot.docs.map((doc) =>
        doc.data()
      );
      setCalificaciones(calificacionesData);
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión.");
    }
  };

  const obtenerCalificacionDeEstudiante = (idEstudiante) => {
    return calificaciones.find((c) => c.estudianteId === idEstudiante);
  };

  const estudiantesFiltradosPorGrupo = estudiantes.filter(
    (est) =>
      (!gradoFiltro || est.grado === gradoFiltro) &&
      (!grupoFiltro || est.grupo === grupoFiltro)
  );

  return (
    <div className="container mt-5">
      {!infoAsignatura ? (
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4 shadow">
              <Card.Body>
                <h3 className="text-center mb-4">Login Docente</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="nombreDocente">
                    <Form.Label>Nombre del docente</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej. Ana Martínez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Ingresar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card className="p-4 shadow">
          <Card.Body>
            <h4 className="mb-3">Bienvenido, {nombre}</h4>
            <p>
              <strong>Asignatura:</strong> {infoAsignatura.nombre} <br />
              <strong>Grados:</strong> {infoAsignatura.grado.join(", ")} <br />
              <strong>Grupos:</strong> {infoAsignatura.grupo.join(", ")}
            </p>

            <hr />

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="gradoFiltro">
                  <Form.Label>Filtrar por grado:</Form.Label>
                  <Form.Select
                    value={gradoFiltro}
                    onChange={(e) => setGradoFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {infoAsignatura.grado.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="grupoFiltro">
                  <Form.Label>Filtrar por grupo:</Form.Label>
                  <Form.Select
                    value={grupoFiltro}
                    onChange={(e) => setGrupoFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {infoAsignatura.grupo.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h5>Estudiantes asignados:</h5>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Grado</th>
                    <th>Grupo</th>
                    <th>Parcial 1</th>
                    <th>Parcial 2</th>
                    <th>Parcial 3</th>
                    <th>Final</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltradosPorGrupo.map((est) => {
                    const nota = obtenerCalificacionDeEstudiante(est.id);
                    return (
                      <tr key={est.id}>
                        <td>{est.nombre}</td>
                        <td>{est.grado}</td>
                        <td>{est.grupo}</td>
                        <td>{nota?.parcial1 || "-"}</td>
                        <td>{nota?.parcial2 || "-"}</td>
                        <td>{nota?.parcial3 || "-"}</td>
                        <td>{nota?.final || "-"}</td>
                        <td>{nota?.observaciones || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => navigate("/inicio")}
            >
              Ir al inicio
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default LoginDocente;
