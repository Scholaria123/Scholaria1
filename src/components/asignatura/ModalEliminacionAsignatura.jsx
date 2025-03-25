import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionAsignatura = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteAsignatura,
}) => {
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres eliminar esta asignatura?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteAsignatura}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionAsignatura;
