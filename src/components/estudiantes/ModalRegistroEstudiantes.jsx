import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig"; // Importa la configuración de Firebase
import { collection, getDocs, addDoc } from "firebase/firestore";

import ReactGA from "react-ga4";

// Inicialización de ReactGA con el ID de seguimiento
ReactGA.initialize([
  {
    trackingId: "G-T4JNY83CWB", // Reemplaza con tu ID de seguimiento
    gaOptions: {
      siteSpeedSampleRate: 100,
    },
  },
]);

const ModalRegistroEstudiante = ({ showModal, setShowModal, fetchEstudiantes }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    grado: "",
    grupo: "",
    asignaturaId: [],
    imagen: "",
  });

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const asignaturasCollection = collection(db, "asignaturas");
        const asignaturasData = await getDocs(asignaturasCollection);
        const asignaturasList = asignaturasData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAsignaturas(asignaturasList);
        setGrados([...new Set(asignaturasList.flatMap((a) => a.grado))]);
        setGrupos([...new Set(asignaturasList.flatMap((a) => a.grupo))]);
        
      } catch (error) {
        console.error("❌ Error al obtener asignaturas:", error);
      }
    };

    fetchAsignaturas();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoEstudiante((prevState) => ({
      ...prevState,
      [name]: name === "asignaturaId" ? [...event.target.selectedOptions].map(option => option.value) : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoEstudiante((prevState) => ({
          ...prevState,
          imagen: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEstudiante = async () => {
    try {
      await addDoc(collection(db, "estudiantes"), {
        ...nuevoEstudiante,
        asignaturaId: Array.isArray(nuevoEstudiante.asignaturaId)
          ? nuevoEstudiante.asignaturaId
          : [nuevoEstudiante.asignaturaId],
        imagen: nuevoEstudiante.imagen || "",
      });

      console.log("✅ Estudiante registrado correctamente");
      fetchEstudiantes(); // Actualiza la lista de estudiantes en el componente padre
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error al registrar estudiante:", error);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={nuevoEstudiante.nombre} onChange={handleInputChange} />
          </Form.Group>
          
          <Form.Group controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" name="direccion" value={nuevoEstudiante.direccion} onChange={handleInputChange} />
          </Form.Group>
          
          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" name="telefono" value={nuevoEstudiante.telefono} onChange={handleInputChange} />
          </Form.Group>
          
          <Form.Group controlId="formGrado">
            <Form.Label>Grado</Form.Label>
            <Form.Select name="grado" value={nuevoEstudiante.grado} onChange={handleInputChange}>
              <option value="">Seleccione un grado</option>
              {grados.map((grado, index) => (<option key={index} value={grado}>{grado}</option>))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="formGrupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Select name="grupo" value={nuevoEstudiante.grupo} onChange={handleInputChange}>
              <option value="">Seleccione un grupo</option>
              {grupos.map((grupo, index) => (<option key={index} value={grupo}>{grupo}</option>))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="formAsignatura">
            <Form.Label>Asignaturas</Form.Label>
            <Form.Select name="asignaturaId" multiple value={nuevoEstudiante.asignaturaId} onChange={handleInputChange}>
              {asignaturas.map((asignatura) => (<option key={asignatura.id} value={asignatura.id}>{asignatura.nombre}</option>))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="formImagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        <Button variant="primary" onClick={handleAddEstudiante}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEstudiante;
