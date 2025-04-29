// components/LoginDocente.jsx
import React, { useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LoginDocente = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [infoAsignatura, setInfoAsignatura] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(collection(db, "docentes"), where("nombre", "==", nombre));
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
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión.");
    }
  };

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
            <h5>Estudiantes asignados:</h5>
            <ul>
              {estudiantes.map((est) => (
                <li key={est.id}>
                  {est.nombre} - {est.grado} {est.grupo}
                </li>
              ))}
            </ul>

            <Button variant="secondary" className="mt-3" onClick={() => navigate("/inicio")}>
              Ir al inicio
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default LoginDocente;
