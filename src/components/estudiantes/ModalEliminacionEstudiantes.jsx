import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionEstudiante = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteEstudiante,
  estudianteAEliminar, // Estudiante que se eliminará
}) => {
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que quieres eliminar al estudiante{" "}
          <strong>{estudianteAEliminar?.nombre}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteEstudiante}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEstudiante;
