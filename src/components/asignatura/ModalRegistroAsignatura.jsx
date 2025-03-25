import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroAsignatura = ({
  showModal,
  setShowModal,
  nuevaAsignatura,
  handleInputChange,
  handleAddAsignatura,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la asignatura"
              name="nombre"
              value={nuevaAsignatura.nombre}
              onChange={handleInputChange} // Maneja el cambio en el input
            />
          </Form.Group>
          <Form.Group controlId="docente">
            <Form.Label>Docente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del docente"
              name="docente"
              value={nuevaAsignatura.docente}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grado de la asignatura"
              name="grado"
              value={nuevaAsignatura.grado}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="nota">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nota de la asignatura"
              name="nota"
              value={nuevaAsignatura.nota}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddAsignatura}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAsignatura;
