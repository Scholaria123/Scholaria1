import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroEstudiante = ({
  showModal,
  setShowModal,
  nuevoEstudiante,
  handleInputChange,
  handleImageChange,
  handleAddEstudiante,
}) => {
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

          <Form.Group controlId="formGrado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 2do"
              name="grado"
              value={nuevoEstudiante.grado}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: A"
              name="grupo"
              value={nuevoEstudiante.grupo}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Calle 2"
              name="direccion"
              value={nuevoEstudiante.direccion}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 56892341"
              name="telefono"
              value={nuevoEstudiante.telefono}
              onChange={handleInputChange}
            />
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
