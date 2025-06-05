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
  Table,
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
  const [asistencias, setAsistencias] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");
  const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().slice(0, 10));
  const [cargando, setCargando] = useState(true);

  // Modal para calificaciones
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
        setCargando(true);
        const q = query(collection(db, "docentes"), where("carnet", "==", carnet));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Docente no encontrado.");
          setCargando(false);
          return;
        }

        const docenteData = snapshot.docs[0].data();
        setNombre(docenteData.nombre);
        const asignaturaId = docenteData.asignaturaId;

        if (!asignaturaId) {
          setError("El docente no tiene asignatura asignada.");
          setCargando(false);
          return;
        }

        const asignaturaDoc = await getDoc(doc(db, "asignaturas", asignaturaId));
        if (!asignaturaDoc.exists()) {
          setError("Asignatura no encontrada.");
          setCargando(false);
          return;
        }

        const asignatura = asignaturaDoc.data();
        setInfoAsignatura({ ...asignatura, id: asignaturaDoc.id });

        // Cargar estudiantes y calificaciones en paralelo
        const [estudiantesSnapshot, calificacionesSnapshot] = await Promise.all([
          getDocs(collection(db, "estudiantes")),
          getDocs(query(collection(db, "calificaciones"), where("asignaturaId", "==", asignaturaId)))
        ]);

        const estudiantesFiltrados = estudiantesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((est) => est.asignaturaId?.includes(asignaturaId));

        setEstudiantes(estudiantesFiltrados);
        setCalificaciones(calificacionesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos del docente.");
      } finally {
        setCargando(false);
      }
    };

    if (carnet) {
      cargarDatosDocente();
    }
  }, [carnet]);

  // Cargar asistencias al cambiar asignatura o fecha
  useEffect(() => {
    const cargarAsistencias = async () => {
      if (!infoAsignatura?.id) return;

      try {
        setCargando(true);
        const q = query(
          collection(db, "asistencias"),
          where("asignaturaId", "==", infoAsignatura.id),
          where("fecha", "==", fechaAsistencia)
        );
        const snapshot = await getDocs(q);
        setAsistencias(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error cargando asistencias:", error);
        setError("Error al cargar las asistencias");
      } finally {
        setCargando(false);
      }
    };

    cargarAsistencias();
  }, [infoAsignatura, fechaAsistencia]);

  const obtenerCalificacionDeEstudiante = (idEstudiante) => {
    return calificaciones.find((c) => c.estudianteId === idEstudiante);
  };

  const obtenerAsistenciaDeEstudiante = (idEstudiante) => {
    return asistencias.find((a) => a.estudianteId === idEstudiante);
  };

  const abrirModal = (estudiante, modoEdicion = false) => {
    setEstudianteSeleccionado(estudiante);
    const nota = obtenerCalificacionDeEstudiante(estudiante.id);
    
    if (nota && modoEdicion) {
      setParcial1(nota.parcial1.toString());
      setParcial2(nota.parcial2.toString());
      setParcial3(nota.parcial3.toString());
      setObservaciones(nota.observaciones || "");
    } else {
      setParcial1("");
      setParcial2("");
      setParcial3("");
      setObservaciones("");
    }
    setMostrarModal(true);
    setError("");
  };

  const validarCalificacion = (valor) => {
    const num = parseFloat(valor);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  const guardarCalificacion = async () => {
    try {
      // Validaciones
      if (!validarCalificacion(parcial1)) {
        throw new Error("Parcial 1 debe ser un número entre 0 y 100");
      }
      if (!validarCalificacion(parcial2)) {
        throw new Error("Parcial 2 debe ser un número entre 0 y 100");
      }
      if (!validarCalificacion(parcial3)) {
        throw new Error("Parcial 3 debe ser un número entre 0 y 100");
      }

      const p1 = parseFloat(parcial1);
      const p2 = parseFloat(parcial2);
      const p3 = parseFloat(parcial3);
      const final = (p1 + p2 + p3) / 3;

      const calificacionExistente = obtenerCalificacionDeEstudiante(estudianteSeleccionado.id);

      const calificacionData = {
        estudianteId: estudianteSeleccionado.id,
        asignaturaId: infoAsignatura.id,
        parcial1: p1,
        parcial2: p2,
        parcial3: p3,
        final: parseFloat(final.toFixed(2)),
        observaciones: observaciones.trim(),
      };

      if (calificacionExistente) {
        const calificacionRef = doc(db, "calificaciones", calificacionExistente.id);
        await updateDoc(calificacionRef, calificacionData);
        setCalificaciones(calificaciones.map((c) =>
          c.estudianteId === estudianteSeleccionado.id ? { ...calificacionData, id: c.id } : c
        ));
      } else {
        const nuevaRef = await addDoc(collection(db, "calificaciones"), calificacionData);
        setCalificaciones([...calificaciones, { ...calificacionData, id: nuevaRef.id }]);
      }

      setMostrarModal(false);
    } catch (err) {
      console.error("Error guardando calificación:", err);
      setError(err.message);
    }
  };

  const manejarCambioAsistencia = async (idEstudiante, estado) => {
    try {
      const registroExistente = asistencias.find(a => a.estudianteId === idEstudiante);
      let nuevasAsistencias;

      if (registroExistente) {
        nuevasAsistencias = asistencias.map(a =>
          a.estudianteId === idEstudiante ? { ...a, estado } : a
        );
      } else {
        nuevasAsistencias = [
          ...asistencias,
          {
            estudianteId: idEstudiante,
            estado,
            asignaturaId: infoAsignatura.id,
            fecha: fechaAsistencia
          }
        ];
      }

      setAsistencias(nuevasAsistencias);
    } catch (error) {
      console.error("Error actualizando asistencia:", error);
      setError("Error al actualizar la asistencia");
    }
  };

  const guardarAsistencia = async () => {
    try {
      setCargando(true);
      const operaciones = asistencias.map(async (registro) => {
        const q = query(
          collection(db, "asistencias"),
          where("estudianteId", "==", registro.estudianteId),
          where("fecha", "==", fechaAsistencia),
          where("asignaturaId", "==", infoAsignatura.id)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          await updateDoc(doc(db, "asistencias", docId), { estado: registro.estado });
        } else {
          await addDoc(collection(db, "asistencias"), {
            estudianteId: registro.estudianteId,
            asignaturaId: infoAsignatura.id,
            fecha: fechaAsistencia,
            estado: registro.estado,
          });
        }
      });

      await Promise.all(operaciones);
      setError("");
      alert("Asistencias guardadas correctamente");
    } catch (error) {
      console.error("Error guardando asistencias:", error);
      setError("Error al guardar las asistencias");
    } finally {
      setCargando(false);
    }
  };

  const estudiantesFiltrados = estudiantes.filter(
    (est) =>
      (!gradoFiltro || est.grado === gradoFiltro) &&
      (!grupoFiltro || est.grupo === grupoFiltro)
  );

  if (cargando && estudiantes.length === 0) {
    return (
      <div className="container mt-5">
        <Alert variant="info">Cargando información...</Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  if (!infoAsignatura) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">No se encontró información de la asignatura</Alert>
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
            <strong>Grados:</strong> {infoAsignatura.grado?.join(", ") || "No especificado"} <br />
            <strong>Grupos:</strong> {infoAsignatura.grupo?.join(", ") || "No especificado"}
          </p>

          <hr />

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="gradoFiltro">
                <Form.Label>Filtrar por grado:</Form.Label>
                <Form.Select
                  value={gradoFiltro}
                  onChange={(e) => setGradoFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  {infoAsignatura.grado?.map((grado, idx) => (
                    <option key={idx} value={grado}>
                      {grado}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="grupoFiltro">
                <Form.Label>Filtrar por grupo:</Form.Label>
                <Form.Select
                  value={grupoFiltro}
                  onChange={(e) => setGrupoFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  {infoAsignatura.grupo?.map((grupo, idx) => (
                    <option key={idx} value={grupo}>
                      {grupo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="fechaAsistencia">
                <Form.Label>Fecha de asistencia:</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaAsistencia}
                  onChange={(e) => setFechaAsistencia(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </Form.Group>
            </Col>
          </Row>

          {estudiantesFiltrados.length === 0 ? (
            <Alert variant="info">No hay estudiantes que coincidan con los filtros</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Grupo</th>
                    <th>Calificación Final</th>
                    <th>Asistencia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map((est) => {
                    const nota = obtenerCalificacionDeEstudiante(est.id);
                    const asistencia = obtenerAsistenciaDeEstudiante(est.id);

                    return (
                      <tr key={est.id}>
                        <td>{est.nombre}</td>
                        <td>{est.grado}</td>
                        <td>{est.grupo}</td>
                        <td>{nota ? nota.final : "Sin registrar"}</td>
                        <td>
                          <Form.Select
                            value={asistencia?.estado || ""}
                            onChange={(e) =>
                              manejarCambioAsistencia(est.id, e.target.value)
                            }
                            disabled={cargando}
                          >
                            <option value="">-- Seleccione --</option>
                            <option value="presente">Presente</option>
                            <option value="ausente">Ausente</option>
                            <option value="justificado">Justificado</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => abrirModal(est)}
                            className="me-2"
                          >
                            <FaPlus />
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => abrirModal(est, true)}
                            disabled={!nota}
                          >
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="success"
              onClick={guardarAsistencia}
              disabled={cargando || estudiantesFiltrados.length === 0}
            >
              {cargando ? "Guardando..." : "Guardar asistencia"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Cerrar sesión
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {obtenerCalificacionDeEstudiante(estudianteSeleccionado?.id) 
              ? "Editar Calificación" 
              : "Registrar Calificación"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 1 (0-100)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={parcial1}
                onChange={(e) => setParcial1(e.target.value)}
                placeholder="Ingrese calificación"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 2 (0-100)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={parcial2}
                onChange={(e) => setParcial2(e.target.value)}
                placeholder="Ingrese calificación"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parcial 3 (0-100)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={parcial3}
                onChange={(e) => setParcial3(e.target.value)}
                placeholder="Ingrese calificación"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones adicionales"
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