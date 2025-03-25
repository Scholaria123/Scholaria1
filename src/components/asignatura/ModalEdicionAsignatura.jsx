import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionAsignatura = ({
  showEditModal,
  setShowEditModal,
  asignaturaEditada,
  handleInputChange,
  handleEditAsignatura,
}) => {
  // Asegurarse de que asignaturaEditada no sea null o undefined
  if (!asignaturaEditada || !asignaturaEditada.id) {
    return null; // No renderizar si no hay datos de asignatura
  }

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
              placeholder="Grado de la asignatura"
              name="grado"
              value={asignaturaEditada.grado || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="nota">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nota de la asignatura"
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
