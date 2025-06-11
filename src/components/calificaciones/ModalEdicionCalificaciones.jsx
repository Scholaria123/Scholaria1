import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionCalificaciones = ({
  show,
  setShow,
  calificacionEditada,
  setCalificacionEditada,
  handleGuardarCambios,
}) => {
  if (!calificacionEditada) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["parcial1", "parcial2", "parcial3"].includes(name)) {
      if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 100)) {
        const updated = {
          ...calificacionEditada,
          [name]: value,
        };

        const p1 = parseFloat(updated.parcial1);
        const p2 = parseFloat(updated.parcial2);
        const p3 = parseFloat(updated.parcial3);

        if (!isNaN(p1) && !isNaN(p2) && !isNaN(p3)) {
          const promedio = ((p1 + p2 + p3) / 3).toFixed(2);
          updated.final = promedio;
        } else {
          updated.final = "";
        }

        setCalificacionEditada(updated);
      }
    } else {
      setCalificacionEditada((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const guardarCambiosYCerrar = () => {
    handleGuardarCambios(calificacionEditada); // Pasamos los datos actualizados
    setShow(false); // Cerramos el modal
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      className="custom-modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Calificaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formParcial1">
            <Form.Label>Parcial 1</Form.Label>
            <Form.Control
              type="number"
              name="parcial1"
              value={calificacionEditada.parcial1?.toString() || ""}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </Form.Group>

          <Form.Group controlId="formParcial2">
            <Form.Label>Parcial 2</Form.Label>
            <Form.Control
              type="number"
              name="parcial2"
              value={calificacionEditada.parcial2?.toString() || ""}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </Form.Group>

          <Form.Group controlId="formParcial3">
            <Form.Label>Parcial 3</Form.Label>
            <Form.Control
              type="number"
              name="parcial3"
              value={calificacionEditada.parcial3?.toString() || ""}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </Form.Group>

          <Form.Group controlId="formFinal">
            <Form.Label>Nota Final (Promedio)</Form.Label>
            <Form.Control
              type="number"
              name="final"
              value={calificacionEditada.final?.toString() || ""}
              readOnly
            />
            <Form.Text className="text-muted">
              Se calcula automáticamente como el promedio de los tres parciales.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formObservaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={calificacionEditada.observaciones || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={guardarCambiosYCerrar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCalificaciones;
