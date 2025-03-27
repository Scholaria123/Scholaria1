import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionEstudiante = ({
  showEditModal,
  setShowEditModal,
  estudianteEditado,
  handleEditInputChange,
  handleEditImageChange,
  handleEditEstudiante
}) => {
  if (!estudianteEditado) return null;

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Nombre */}
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del estudiante"
              name="nombre"
              value={estudianteEditado.nombre || ""}
              onChange={handleEditInputChange}
            />
          </Form.Group>

          {/* Grado */}
          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grado"
              name="grado"
              value={estudianteEditado.grado || ""}
              onChange={handleEditInputChange}
            />
          </Form.Group>

          {/* Grupo */}
          <Form.Group controlId="grupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Grupo"
              name="grupo"
              value={estudianteEditado.grupo || ""}
              onChange={handleEditInputChange}
            />
          </Form.Group>

          {/* Imagen */}
          <Form.Group controlId="imagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              onChange={handleEditImageChange} // Manejar la subida de la imagen
            />
            {estudianteEditado.imagen && (
              <div className="mt-3">
                <img
                  src={estudianteEditado.imagen}
                  alt="Imagen Estudiante"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleEditEstudiante}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEstudiante;
