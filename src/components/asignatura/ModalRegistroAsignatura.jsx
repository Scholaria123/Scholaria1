import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroAsignatura = ({
  showModal,
  setShowModal,
  nuevaAsignatura = {},
  handleInputChange,
  handleAddAsignatura,
}) => {
  // Opciones de grados y grupos predefinidas (puedes cambiarlas si quieres)
  const opcionesGrados = ["1ro", "2do", "3ro", "4to", "5to", "6to"];
  const opcionesGrupos = ["a", "b"];

  // Función para manejar cambios en los selectores múltiples
  const handleMultiSelectChange = (event) => {
    const { name, options } = event.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    handleInputChange({ target: { name, value: selectedValues } });
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la asignatura"
              name="nombre"
              value={nuevaAsignatura?.nombre || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="docente">
            <Form.Label>Docente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del docente"
              name="docente"
              value={nuevaAsignatura?.docente || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          {/* Selector múltiple de Grados */}
          <Form.Group controlId="grado">
            <Form.Label>Grado(s)</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="grado"
              value={nuevaAsignatura?.grado || []}
              onChange={handleMultiSelectChange}
            >
              {opcionesGrados.map((grado) => (
                <option key={grado} value={grado}>
                  {grado}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {/* Selector múltiple de Grupos */}
          <Form.Group controlId="grupo">
            <Form.Label>Grupo(s)</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="grupo"
              value={nuevaAsignatura?.grupo || []}
              onChange={handleMultiSelectChange}
            >
              {opcionesGrupos.map((grupo) => (
                <option key={grupo} value={grupo}>
                  {grupo}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddAsignatura}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAsignatura;