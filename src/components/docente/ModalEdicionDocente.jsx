import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "./EditarDocente.css";

const ModalEdicionDocente = ({
  showEditModal,
  setShowEditModal,
  docenteEditado,
  setDocenteEditado,
  fetchData,
}) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentesUnicos, setDocentesUnicos] = useState([]);
  const [asignaturasFiltradas, setAsignaturasFiltradas] = useState([]);
  const [imagenBase64, setImagenBase64] = useState("");

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "asignaturas"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAsignaturas(lista);

        const docentes = [...new Set(lista.map((a) => a.docente))];
        setDocentesUnicos(docentes);
      } catch (error) {
        console.error("❌ Error al obtener asignaturas:", error);
      }
    };

    fetchAsignaturas();
  }, []);

  useEffect(() => {
    if (showEditModal && docenteEditado?.docente && asignaturas.length > 0) {
      const filtradas = asignaturas.filter((a) => a.docente === docenteEditado.docente);
      setAsignaturasFiltradas(filtradas);

      // Asegura que asignaturaId esté en la lista si ya existe
      if (!filtradas.some(a => a.id === docenteEditado.asignaturaId)) {
        setDocenteEditado(prev => ({
          ...prev,
          asignaturaId: filtradas.length > 0 ? filtradas[0].id : ""
        }));
      }
    }
  }, [showEditModal, docenteEditado?.docente, asignaturas]);

  // Si no hay docenteEditado, no se muestra el modal
  if (!docenteEditado) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocenteEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocenteChange = (e) => {
    const docenteSeleccionado = e.target.value;
    const nuevasAsignaturas = asignaturas.filter((a) => a.docente === docenteSeleccionado);

    setDocenteEditado((prev) => ({
      ...prev,
      docente: docenteSeleccionado,
      asignaturaId: nuevasAsignaturas.length > 0 ? nuevasAsignaturas[0].id : "",
    }));

    setAsignaturasFiltradas(nuevasAsignaturas);
  };

  const handleAsignaturaChange = (e) => {
    setDocenteEditado((prev) => ({
      ...prev,
      asignaturaId: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

   const validateInputs = () => {
  if (!/^\d{6}$/.test(docenteEditado.carnet)) {
    alert("El carnet debe contener exactamente 6 dígitos numéricos.");
    return false;
  }

  if (!/^\d{7,8}$/.test(docenteEditado.telefono)) {
    alert("El teléfono debe tener entre 7 y 8 dígitos numéricos.");
    return false;
  }

  return true;
};


  const handleSaveChanges = async () => {
    if (!validateInputs()) return;


    if (!docenteEditado.id) {
      console.error("❌ No hay ID del docente para actualizar.");
      return;
    }

    try {
      const ref = doc(db, "docentes", docenteEditado.id);
      const updateData = {
        ...docenteEditado,
        imagen: imagenBase64 || docenteEditado.imagen,
      };
      await updateDoc(ref, updateData);
      console.log("✅ Docente actualizado correctamente");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("❌ Error al actualizar docente:", error);
    }
  };

return (
  <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="custom-modal">
    <Modal.Header closeButton>
      <Modal.Title>Editar Docente</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formDocente">
          <Form.Label>Docente</Form.Label>
          <Form.Select
            name="docente"
            value={docenteEditado.docente || ""}
            onChange={handleDocenteChange}
          >
            <option value="">Seleccione un docente</option>
            {docentesUnicos.map((docente, index) => (
              <option key={index} value={docente}>
                {docente}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formAsignatura">
          <Form.Label>Asignatura</Form.Label>
          <Form.Select
            name="asignaturaId"
            value={docenteEditado.asignaturaId || ""}
            onChange={handleAsignaturaChange}
            disabled={asignaturasFiltradas.length === 0}
          >
            <option value="">Seleccione una asignatura</option>
            {asignaturasFiltradas.map((asignatura) => (
              <option key={asignatura.id} value={asignatura.id}>
                {asignatura.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="titulo">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={docenteEditado.titulo || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="direccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={docenteEditado.direccion || ""}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="telefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={docenteEditado.telefono || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,8}$/.test(value)) {
                setDocenteEditado((prev) => ({ ...prev, telefono: value }));
              }
            }}
            placeholder="Máx. 8 dígitos"
          />
          {docenteEditado.telefono && docenteEditado.telefono.length < 7 && (
            <Form.Text className="text-warning">
              El teléfono debería tener al menos 7 dígitos.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formCarnet">
          <Form.Label>Carnet</Form.Label>
          <Form.Control
            type="text"
            name="carnet"
            value={docenteEditado.carnet || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) {
                setDocenteEditado((prev) => ({ ...prev, carnet: value }));
              }
            }}
            placeholder="Carnet de 6 dígitos"
          />
          {docenteEditado.carnet && docenteEditado.carnet.length !== 6 && (
            <Form.Text className="text-danger">
              El carnet debe tener exactamente 6 dígitos numéricos.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="imagen">
          <Form.Label>Imagen</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

        {(imagenBase64 || docenteEditado.imagen) && (
          <div className="preview-image-container">
            <img
              src={imagenBase64 || docenteEditado.imagen}
              alt="Previsualización"
              className="preview-image"
            />
          </div>
        )}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button className="btn-cancelar" onClick={() => setShowEditModal(false)}>
        Cerrar
      </Button>
      <Button variant="primary" onClick={handleSaveChanges}>
        Guardar Cambios
      </Button>
    </Modal.Footer>
  </Modal>
);


};

export default ModalEdicionDocente;
