import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";
import "../App.css";

const LoginDocente = () => {
  const { carnet } = useParams();
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [infoAsignatura, setInfoAsignatura] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [parcial1, setParcial1] = useState("");
  const [parcial2, setParcial2] = useState("");
  const [parcial3, setParcial3] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatosDocente = async () => {
      try {
        const q = query(collection(db, "docentes"), where("carnet", "==", carnet));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Docente no encontrado.");
          return;
        }

        const docenteData = snapshot.docs[0].data();
        setNombre(docenteData.nombre);
        const asignaturaId = docenteData.asignaturaId;

        const asignaturaDoc = await getDoc(doc(db, "asignaturas", asignaturaId));
        const asignatura = asignaturaDoc.data();
        setInfoAsignatura({ ...asignatura, id: asignaturaDoc.id });

        const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
        const estudiantesFiltrados = estudiantesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((est) => est.asignaturaId?.includes(asignaturaId));

        setEstudiantes(estudiantesFiltrados);

        const calificacionesSnapshot = await getDocs(
          query(collection(db, "calificaciones"), where("asignaturaId", "==", asignaturaId))
        );
        const calificacionesData = calificacionesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCalificaciones(calificacionesData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos.");
      }
    };

    if (carnet) {
      cargarDatosDocente();
    }
  }, [carnet]);

  const obtenerCalificacionDeEstudiante = (idEstudiante) => {
    return calificaciones.find((c) => c.estudianteId === idEstudiante);
  };

  const abrirModal = (estudiante, modoEdicion = false) => {
    setEstudianteSeleccionado(estudiante);
    const nota = obtenerCalificacionDeEstudiante(estudiante.id);
    if (nota && modoEdicion) {
      setParcial1(nota.parcial1);
      setParcial2(nota.parcial2);
      setParcial3(nota.parcial3);
      setObservaciones(nota.observaciones || "");
    } else {
      setParcial1("");
      setParcial2("");
      setParcial3("");
      setObservaciones("");
    }
    setMostrarModal(true);
  };

  const guardarCalificacion = async () => {
    const final = (parseFloat(parcial1 || 0) + parseFloat(parcial2 || 0) + parseFloat(parcial3 || 0)) / 3;
    const calificacionExistente = obtenerCalificacionDeEstudiante(estudianteSeleccionado.id);

    const calificacionData = {
      estudianteId: estudianteSeleccionado.id,
      asignaturaId: infoAsignatura.id,
      parcial1: parseFloat(parcial1),
      parcial2: parseFloat(parcial2),
      parcial3: parseFloat(parcial3),
      final: parseFloat(final.toFixed(2)),
      observaciones,
    };

    if (calificacionExistente) {
      const calificacionRef = doc(db, "calificaciones", calificacionExistente.id);
      await updateDoc(calificacionRef, calificacionData);
      const nuevasCalificaciones = calificaciones.map((c) =>
        c.estudianteId === estudianteSeleccionado.id ? { ...calificacionData, id: c.id } : c
      );
      setCalificaciones(nuevasCalificaciones);
    } else {
      const nuevaRef = await addDoc(collection(db, "calificaciones"), calificacionData);
      setCalificaciones([...calificaciones, { ...calificacionData, id: nuevaRef.id }]);
    }

    setMostrarModal(false);
  };

  const estudiantesFiltradosPorGrupo = estudiantes.filter(
    (est) =>
      (!gradoFiltro || est.grado === gradoFiltro) &&
      (!grupoFiltro || est.grupo === grupoFiltro)
  );

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!infoAsignatura) {
    return (
      <div className="container mt-5">
        <p>Cargando información del docente...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
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
                  <th>Acciones</th>
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
                      <td>
                        {!nota ? (
                          <Button variant="success" size="sm" onClick={() => abrirModal(est)}>
                            <FaPlus />
                          </Button>
                        ) : (
                          <Button variant="warning" size="sm" onClick={() => abrirModal(est, true)}>
                            <FaEdit />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button variant="secondary" className="mt-3" onClick={() => navigate("/inicio")}>
            Ir al inicio
          </Button>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {obtenerCalificacionDeEstudiante(estudianteSeleccionado?.id)
              ? "Editar calificación"
              : "Nueva calificación"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 1</Form.Label>
              <Form.Control
                type="number"
                value={parcial1}
                onChange={(e) => setParcial1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 2</Form.Label>
              <Form.Control
                type="number"
                value={parcial2}
                onChange={(e) => setParcial2(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 3</Form.Label>
              <Form.Control
                type="number"
                value={parcial3}
                onChange={(e) => setParcial3(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCalificacion}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginDocente;
