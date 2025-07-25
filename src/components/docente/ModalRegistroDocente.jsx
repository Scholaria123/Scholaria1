import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./ModalRegistroDocente.css";

const ModalRegistroDocente = ({ showModal, setShowModal, fetchDocentes }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentesUnicos, setDocentesUnicos] = useState([]);
  const [asignaturasFiltradas, setAsignaturasFiltradas] = useState([]);

  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: "",
    carnet: "", // 👈 Nuevo campo
    direccion: "",
    telefono: "",
    titulo: "",
    asignaturaId: "",
    imagen: "",
  });

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const asignaturasSnapshot = await getDocs(
          collection(db, "asignaturas")
        );
        const asignaturasList = asignaturasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAsignaturas(asignaturasList);
        const docentes = [...new Set(asignaturasList.map((a) => a.docente))];
        setDocentesUnicos(docentes);
      } catch (error) {
        console.error("❌ Error al obtener asignaturas:", error);
      }
    };

    fetchAsignaturas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoDocente((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre") {
      const asignaturasDelDocente = asignaturas.filter(
        (a) => a.docente === value
      );
      setAsignaturasFiltradas(asignaturasDelDocente);

      if (asignaturasDelDocente.length > 0) {
        setNuevoDocente((prev) => ({
          ...prev,
          asignaturaId: asignaturasDelDocente[0].id,
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoDocente((prev) => ({
          ...prev,
          imagen: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!nuevoDocente.nombre.trim()) {
      alert("El nombre del docente es obligatorio.");
      return false;
    }

    if (!nuevoDocente.carnet.trim()) {
      alert("El carnet del docente es obligatorio.");
      return false;
    }

    if (!/^\d{6}$/.test(nuevoDocente.carnet)) {
      alert("El carnet debe contener exactamente 6 dígitos numéricos.");
      return false;
    }

    if (!nuevoDocente.asignaturaId) {
      alert("Debe seleccionar una asignatura.");
      return false;
    }

    if (!nuevoDocente.direccion.trim()) {
      alert("La dirección es obligatoria.");
      return false;
    }

    if (!/^\d{8}$/.test(nuevoDocente.telefono)) {
      alert(
        "El número de teléfono debe contener exactamente 8 dígitos numéricos."
      );
      return false;
    }

    if (!nuevoDocente.titulo.trim()) {
      alert("El título es obligatorio.");
      return false;
    }

    return true;
  };

  const handleAddDocenteWithValidation = async () => {
    if (validateForm()) {
      try {
        await addDoc(collection(db, "docentes"), nuevoDocente);
        console.log("✅ Docente registrado correctamente");
        fetchDocentes();
        setShowModal(false);
      } catch (error) {
        console.error("❌ Error al registrar docente:", error);
      }
    }
  };

return (
  <Modal
    show={showModal}
    onHide={() => setShowModal(false)}
    className="custom-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title>Registrar Docente</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre del Docente</Form.Label>
          <Form.Select
            name="nombre"
            value={nuevoDocente.nombre}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un docente</option>
            {docentesUnicos.map((docente, index) => (
              <option key={index} value={docente}>
                {docente}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formCarnet">
          <Form.Label>Carnet</Form.Label>
          <Form.Control
            type="text"
            name="carnet"
            value={nuevoDocente.carnet}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) {
                setNuevoDocente((prev) => ({ ...prev, carnet: value }));
              }
            }}
            placeholder="Carnet de 6 dígitos"
            required
          />
          {nuevoDocente.carnet && nuevoDocente.carnet.length !== 6 && (
            <Form.Text className="text-danger">
              El carnet debe tener exactamente 6 dígitos numéricos.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formAsignaturaId">
          <Form.Label>Asignatura</Form.Label>
          <Form.Select
            name="asignaturaId"
            value={nuevoDocente.asignaturaId}
            onChange={handleInputChange}
          >
            <option value="">Seleccione una asignatura</option>
            {asignaturasFiltradas.map((asig) => (
              <option key={asig.id} value={asig.id}>
                {asig.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formDireccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={nuevoDocente.direccion}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formTelefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={nuevoDocente.telefono}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,8}$/.test(value)) {
                setNuevoDocente((prev) => ({
                  ...prev,
                  telefono: value,
                }));
              }
            }}
            placeholder="Número de teléfono (8 dígitos)"
            required
          />
          {nuevoDocente.telefono && nuevoDocente.telefono.length !== 8 && (
            <Form.Text className="text-danger">
              El número debe tener exactamente 8 dígitos.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formTitulo">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={nuevoDocente.titulo}
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
          {nuevoDocente.imagen && (
            <div className="preview-image-container">
              <img
                src={nuevoDocente.imagen}
                alt="Previsualización"
                className="preview-image"
              />
            </div>
          )}
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cerrar
      </Button>
      <Button variant="primary" onClick={handleAddDocenteWithValidation}>
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
);
};

export default ModalRegistroDocente;
