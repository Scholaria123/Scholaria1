import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";

const ModalEdicionCalificaciones = ({
  show,
  setShow,
  calificacionEditada,
  setCalificacionEditada,
  fetchCalificaciones, // se asume que hay una función para refrescar los datos
}) => {
  if (!calificacionEditada) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["parcial1", "parcial2", "parcial3"].includes(name)) {
      if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 100)) {
        const updated = { ...calificacionEditada, [name]: value };

        const { parcial1, parcial2, parcial3 } = {
          ...updated,
          [name]: value,
        };

        if (parcial1 && parcial2 && parcial3) {
          const promedio =
            (parseFloat(parcial1) +
              parseFloat(parcial2) +
              parseFloat(parcial3)) /
            3;
          updated.final = promedio.toFixed(2);
        }

        setCalificacionEditada(updated);
      }
    } else {
      setCalificacionEditada((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardarCambios = async () => {
    try {
      const calificacionRef = doc(db, "calificaciones", calificacionEditada.id);
      await updateDoc(calificacionRef, {
        parcial1: Number(calificacionEditada.parcial1),
        parcial2: Number(calificacionEditada.parcial2),
        parcial3: Number(calificacionEditada.parcial3),
        final: Number(calificacionEditada.final),
        observaciones: calificacionEditada.observaciones || "",
      });

      setShow(false);
      fetchCalificaciones?.(); // refresca los datos si se proporciona
    } catch (error) {
      console.error("❌ Error al actualizar calificación:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
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
              onChange={handleInputChange}
              min="0"
              max="100"
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
        <Button variant="primary" onClick={handleGuardarCambios}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCalificaciones;
