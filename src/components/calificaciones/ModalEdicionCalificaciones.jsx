import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const ModalEdicionCalificaciones = ({
    show,
    setShow,
    calificacionEditada,
    setCalificacionEditada,
    onCalificacionActualizada,
  }) => {
  
  if (!calificacionEditada) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCalificacionEditada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (calificacionEditada) {
      setCalificacionEditada((prevState) => ({
        ...prevState,
        parcial1: prevState.parcial1 || "",
        parcial2: prevState.parcial2 || "",
        parcial3: prevState.parcial3 || "",
        final: prevState.final || "",
        observaciones: prevState.observaciones || "",
      }));
    }
  }, [calificacionEditada]);

  const calcularPromedio = (p1, p2, p3) => {
    const nums = [p1, p2, p3].map(n => parseFloat(n));
    const validos = nums.filter(n => !isNaN(n));
    if (validos.length === 0) return "";
    const suma = validos.reduce((acc, n) => acc + n, 0);
    return (suma / validos.length).toFixed(2);
  };
  
  const handleUpdateCalificacion = async () => {
    if (!calificacionEditada.id) {
      console.error("ID no disponible para la calificación");
      return;
    }
  
    try {
      const promedio = calcularPromedio(
        calificacionEditada.parcial1,
        calificacionEditada.parcial2,
        calificacionEditada.parcial3
      );
  
      const calificacionRef = doc(db, "calificaciones", calificacionEditada.id);
      await updateDoc(calificacionRef, {
        asignaturaId: calificacionEditada.asignaturaId,
        estudianteId: calificacionEditada.estudianteId,
        parcial1: calificacionEditada.parcial1 || "",
        parcial2: calificacionEditada.parcial2 || "",
        parcial3: calificacionEditada.parcial3 || "",
        final: promedio,
        observaciones: calificacionEditada.observaciones || "",
      });
  
      setShow(false);
      if (onCalificacionActualizada) {
        onCalificacionActualizada();
      }
    } catch (error) {
      console.error("Error al actualizar la calificación:", error);
    }
  };
 

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Calificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="asignaturaId">
            <Form.Label>Asignatura ID</Form.Label>
            <Form.Control
              type="text"
              name="asignaturaId"
              value={calificacionEditada.asignaturaId || ""}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="estudianteId">
            <Form.Label>Estudiante ID</Form.Label>
            <Form.Control
              type="text"
              name="estudianteId"
              value={calificacionEditada.estudianteId || ""}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="parcial1">
            <Form.Label>Parcial 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese calificación parcial 1"
              name="parcial1"
              value={calificacionEditada.parcial1}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="parcial2">
            <Form.Label>Parcial 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese calificación parcial 2"
              name="parcial2"
              value={calificacionEditada.parcial2}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="parcial3">
            <Form.Label>Parcial 3</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese calificación parcial 3"
              name="parcial3"
              value={calificacionEditada.parcial3}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="final">
  <Form.Label>Final (Promedio)</Form.Label>
  <Form.Control
    type="text"
    name="final"
    value={calcularPromedio(
      calificacionEditada.parcial1,
      calificacionEditada.parcial2,
      calificacionEditada.parcial3
    )}
    disabled
  />
</Form.Group>



          <Form.Group controlId="observaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese observaciones"
              name="observaciones"
              value={calificacionEditada.observaciones}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleUpdateCalificacion}>
  Guardar Cambios
</Button>

      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCalificaciones;
