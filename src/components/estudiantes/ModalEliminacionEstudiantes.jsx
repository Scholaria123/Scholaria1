import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEliminacionEstudiante = ({
  showDeleteModal,
  setShowDeleteModal,
  asignaturas, // Recibimos las asignaturas como prop
  estudianteAEliminar, // El estudiante a eliminar
  handleDeleteEstudiante,
  handleInputChange, // Función para manejar cambios en el ComboBox
}) => {
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Confirmación de eliminación */}
        <p>¿Estás seguro de que deseas eliminar al estudiante {estudianteAEliminar?.nombre}?</p>

        {/* ComboBox para seleccionar la asignatura antes de eliminar */}
        <Form.Group className="mb-3">
          <Form.Label>Asignatura</Form.Label>
          <Form.Control
            as="select"
            name="asignatura"
            value={estudianteAEliminar?.asignatura || ""}
            onChange={handleInputChange}
          >
            <option value="">Selecciona una asignatura</option>
            {asignaturas?.map((asignatura) => (
              <option key={asignatura.id} value={asignatura.nombre}>
                {asignatura.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => handleDeleteEstudiante(estudianteAEliminar)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEstudiante;
