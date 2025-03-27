import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroAsignatura = ({
  showModal,
  setShowModal,
  nuevaAsignatura = {}, // 👈 Evita 'undefined'
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
              value={nuevaAsignatura?.nombre || ''} // 👈 Usa ? para evitar errores
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="docente">
            <Form.Label>Docente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del docente"
              name="docente"
              value={nuevaAsignatura?.docente || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grado de la asignatura"
              name="grado"
              value={nuevaAsignatura?.grado || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="grupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grupo de la asignatura"
              name="grupo"
              value={nuevaAsignatura?.grupo || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="estudiante">
            <Form.Label>Estudiante</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del estudiante"
              name="estudiante"
              value={nuevaAsignatura?.estudiante || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="nota">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nota de la asignatura"
              name="nota"
              value={nuevaAsignatura?.nota || ''}
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
