import { Modal, Button } from "react-bootstrap";

const ModalEliminarCalificaciones = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteCalificacion,
  calificacionAEliminar, // Objeto de calificación que se eliminará
  obtenerNombreAsignatura,
  obtenerNombreEstudiante
}) => {
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Calificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar la calificación de{" "}
          <strong>{obtenerNombreEstudiante(calificacionAEliminar?.estudianteId)}</strong> 
          {" "}en la asignatura{" "}
          <strong>{obtenerNombreAsignatura(calificacionAEliminar?.asignaturaId)}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteCalificacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarCalificaciones;
