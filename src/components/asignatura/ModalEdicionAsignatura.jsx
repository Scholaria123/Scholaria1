import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ModalEdicionAsignatura = ({
  showEditModal,
  setShowEditModal,
  asignaturaEditada,
  setAsignaturaEditada,
  setAsignaturas, // Para actualizar la tabla sin recargar
}) => {
  if (!asignaturaEditada) return null;

  // Manejador de cambio de los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsignaturaEditada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejar la edición de la asignatura
  const handleEditAsignatura = async () => {
    if (!asignaturaEditada.id) {
      console.error("Error: La asignatura no tiene un ID");
      return;
    }

    const asignaturaRef = doc(db, "asignaturas", asignaturaEditada.id);

    try {
      await updateDoc(asignaturaRef, asignaturaEditada);
      console.log("Asignatura actualizada correctamente");

      // ACTUALIZAR LISTA SIN RECARGAR PÁGINA
      setAsignaturas((prevAsignaturas) =>
        prevAsignaturas.map((asig) =>
          asig.id === asignaturaEditada.id ? asignaturaEditada : asig
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
    }
  };

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la asignatura"
              name="nombre"
              value={asignaturaEditada.nombre || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="docente">
            <Form.Label>Docente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del docente"
              name="docente"
              value={asignaturaEditada.docente || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grado"
              name="grado"
              value={asignaturaEditada.grado || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="grupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grupo"
              name="grupo"
              value={asignaturaEditada.grupo || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="estudiante">
            <Form.Label>Estudiante</Form.Label>
            <Form.Control
              type="text"
              placeholder="Estudiante"
              name="estudiante"
              value={asignaturaEditada.estudiante || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="nota">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              type="number"
              placeholder="Nota"
              name="nota"
              value={asignaturaEditada.nota || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleEditAsignatura}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionAsignatura;
