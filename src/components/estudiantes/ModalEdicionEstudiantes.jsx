import React from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const ModalEdicionEstudiante = ({
  showEditModal,
  setShowEditModal,
  estudianteEditado,
  handleEditInputChange,
  handleEditImageChange,
  handleEditEstudiante,
}) => {
  if (!estudianteEditado) return null;

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
  type="text"
  name="nombre"
  value={estudianteEditado.nombre}
  onChange={handleEditInputChange}
/>

          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Asignatura</Form.Label>
            <Form.Control
  type="text"
  name="asignatura"
  value={estudianteEditado.asignatura}
  onChange={handleEditInputChange}
/>

          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen Actual</Form.Label>
            {estudianteEditado.imagen && (
              <Image src={estudianteEditado.imagen} width="100" className="mb-2" />
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEditEstudiante}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEstudiante;