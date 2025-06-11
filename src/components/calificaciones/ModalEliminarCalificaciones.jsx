import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminarCalificaciones = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteCalificacion,
  calificacionAEliminar,
  obtenerNombreAsignatura,
  obtenerNombreEstudiante,
}) => {
  return (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      backdrop="static"
      keyboard={false}
      className="custom-modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Calificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar la calificación de{" "}
          <strong>{obtenerNombreEstudiante(calificacionAEliminar?.estudianteId)}</strong>{" "}
          en la asignatura{" "}
          <strong>{obtenerNombreAsignatura(calificacionAEliminar?.asignaturaId)}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteCalificacion}
          disabled={!calificacionAEliminar?.id} // para evitar errores si no hay ID
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarCalificaciones;
