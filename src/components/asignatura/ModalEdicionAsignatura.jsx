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
  handleEditAsignatura,  // ✅ Se usa la función pasada como prop
}) => {

  if (!asignaturaEditada) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsignaturaEditada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => handleEditAsignatura()}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionAsignatura;
