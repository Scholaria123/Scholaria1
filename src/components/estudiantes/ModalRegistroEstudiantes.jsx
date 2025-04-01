import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig"; // Importa la configuración de Firebase
import { collection, getDocs } from "firebase/firestore";

const ModalRegistroEstudiante = ({
  showModal,
  setShowModal,
  nuevoEstudiante,
  handleInputChange,
  handleImageChange,
  handleAddEstudiante,
}) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const asignaturasCollection = collection(db, "asignaturas");
        const asignaturasData = await getDocs(asignaturasCollection);
        const asignaturasList = asignaturasData.docs.map((doc) => doc.data());

        setAsignaturas(asignaturasList);

        const uniqueGrados = [...new Set(asignaturasList.map((a) => a.grado))];
        const uniqueGrupos = [...new Set(asignaturasList.map((a) => a.grupo))];
        
        setGrados(uniqueGrados);
        setGrupos(uniqueGrupos);
      } catch (error) {
        console.error("❌ Error al obtener asignaturas:", error);
      }
    };

    fetchAsignaturas();
  }, []);

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

          <Form.Group controlId="formGrado">
            <Form.Label>Grado</Form.Label>
            <Form.Select
              name="grado"
              value={nuevoEstudiante.grado || ""}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un grado</option>
              {grados.map((grado, index) => (
                <option key={index} value={grado}>
                  {grado}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Select
              name="grupo"
              value={nuevoEstudiante.grupo || ""}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un grupo</option>
              {grupos.map((grupo, index) => (
                <option key={index} value={grupo}>
                  {grupo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formAsignatura">
            <Form.Label>Asignatura</Form.Label>
            <Form.Select
              name="asignaturaId"
              value={nuevoEstudiante.asignaturaId || ""}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una asignatura</option>
              {asignaturas.map((asignatura, index) => (
                <option key={index} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formImagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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

