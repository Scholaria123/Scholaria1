import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ModalEdicionAsignatura = ({
  showEditModal,
  setShowEditModal,
  asignaturaEditada,
  setAsignaturaEditada,
  handleEditAsignatura,
}) => {
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGradosYGrupos = async () => {
      try {
        const asignaturasCollection = collection(db, "asignaturas");
        const asignaturasSnapshot = await getDocs(asignaturasCollection);
        const asignaturasList = asignaturasSnapshot.docs.map((doc) => doc.data());

        const gradosUnicos = [...new Set(asignaturasList.flatMap((a) => a.grado || []))];
        const gruposUnicos = [...new Set(asignaturasList.flatMap((a) => a.grupo || []))];

        setGrados(gradosUnicos);
        setGrupos(gruposUnicos);
      } catch (error) {
        console.error("❌ Error al obtener grados y grupos:", error);
      }
    };

    fetchGradosYGrupos();
  }, []);

  if (!asignaturaEditada) return null;

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setAsignaturaEditada((prevState) => ({
      ...prevState,
      [name]: selectedValues,
    }));
  };

  return (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      backdrop="static"
      keyboard={false}
      className="custom-modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Asignatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la asignatura"
              name="nombre"
              value={asignaturaEditada.nombre || ""}
              onChange={(e) =>
                setAsignaturaEditada({ ...asignaturaEditada, nombre: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="docente">
            <Form.Label>Docente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del docente"
              name="docente"
              value={asignaturaEditada.docente || ""}
              onChange={(e) =>
                setAsignaturaEditada({ ...asignaturaEditada, docente: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="grado"
              value={asignaturaEditada.grado || []}
              onChange={handleMultiSelectChange}
            >
              {grados.map((grado, index) => (
                <option key={index} value={grado}>{grado}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="grupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="grupo"
              value={asignaturaEditada.grupo || []}
              onChange={handleMultiSelectChange}
            >
              {grupos.map((grupo, index) => (
                <option key={index} value={grupo}>{grupo}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleEditAsignatura}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionAsignatura;