import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroEstudiante = ({
  showModal,
  setShowModal,
  nuevoEstudiante,
  handleInputChange,
  handleImageChange,
  handleAddEstudiante,
  asignaturas,
}) => {
  // Verifica que las asignaturas estén disponibles
  if (!asignaturas || asignaturas.length === 0) {
    return <div>No hay asignaturas disponibles</div>;
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del estudiante"
              name="nombre"
              value={nuevoEstudiante.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group controlId="formAsignatura">
  <Form.Label>Asignatura</Form.Label>
  <Form.Control
    as="select"
    name="asignatura"
    value={nuevoEstudiante.asignatura}
    onChange={handleInputChange}
  >
    <option value="">Selecciona una asignatura</option>
    {asignaturas.map((asignatura) => (
      <option key={asignatura.id} value={asignatura.id}>
        {asignatura.nombre}
      </option>
    ))}
  </Form.Control>
</Form.Group>
 


          <Form.Group controlId="formImagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddEstudiante}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEstudiante;
