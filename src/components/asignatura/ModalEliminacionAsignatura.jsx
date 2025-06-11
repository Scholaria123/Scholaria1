import { Modal, Button } from "react-bootstrap";

const ModalEliminacionAsignatura = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteAsignatura,
  asignaturaAEliminar,
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
        <Modal.Title>Eliminar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que quieres eliminar la asignatura{" "}
          <strong>{asignaturaAEliminar?.nombre}</strong>?
        </p>
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