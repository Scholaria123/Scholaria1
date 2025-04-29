import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const ModalAgregarCalificacion = ({ show, onHide, estudiante, fetchEstudiantes }) => {
  const [materia, setMateria] = useState("");
  const [nota, setNota] = useState("");

  useEffect(() => {
    // Limpiar el formulario al abrir
    if (show) {
      setMateria("");
      setNota("");
    }
  }, [show]);

  const handleAgregar = async () => {
    if (!materia || !nota || isNaN(nota)) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    try {
      const ref = doc(db, "estudiantes", estudiante.id);
      await updateDoc(ref, {
        calificaciones: arrayUnion({ materia, nota: parseFloat(nota) }),
      });
      onHide();
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al agregar calificación:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Calificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Materia</Form.Label>
          <Form.Control
            type="text"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Ej: Matemáticas"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nota</Form.Label>
          <Form.Control
            type="number"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: 85"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAgregarCalificacion;
