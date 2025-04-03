import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig"; // Asegúrate de que la ruta es correcta
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const ModalEdicionEstudiante = ({
  showEditModal,
  setShowEditModal,
  estudianteEditado,
  setEstudianteEditado,
  fetchData,
}) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [imagenBase64, setImagenBase64] = useState("");

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

  if (!estudianteEditado) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleAsignaturaChange = (e) => {
    const selectedAsignaturas = Array.from(e.target.selectedOptions, (option) => option.value);
    setEstudianteEditado((prev) => ({ ...prev, asignaturaId: selectedAsignaturas }));
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

  const handleSaveChanges = async () => {
    if (!estudianteEditado.id) {
      console.error("❌ No hay ID del estudiante para actualizar.");
      return;
    }

    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      const updateData = {
        ...estudianteEditado,
        imagen: imagenBase64 || estudianteEditado.imagen,
      };
      await updateDoc(estudianteRef, updateData);
      console.log("✅ Estudiante actualizado correctamente");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("❌ Error al actualizar estudiante:", error);
    }
  };

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={estudianteEditado.nombre || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="grado">
            <Form.Label>Grado</Form.Label>
            <Form.Select name="grado" value={estudianteEditado.grado || ""} onChange={handleInputChange}>
              <option value="">Seleccione un grado</option>
              {grados.map((grado, index) => (
                <option key={index} value={grado}>{grado}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="grupo">
            <Form.Label>Grupo</Form.Label>
            <Form.Select name="grupo" value={estudianteEditado.grupo || ""} onChange={handleInputChange}>
              <option value="">Seleccione un grupo</option>
              {grupos.map((grupo, index) => (
                <option key={index} value={grupo}>{grupo}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="asignatura">
            <Form.Label>Asignaturas</Form.Label>
            <Form.Select name="asignaturaId" multiple value={estudianteEditado.asignaturaId || []} onChange={handleAsignaturaChange}>
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Mantén presionada la tecla Ctrl (Windows) o Cmd (Mac) para seleccionar varias asignaturas.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="imagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEstudiante;  