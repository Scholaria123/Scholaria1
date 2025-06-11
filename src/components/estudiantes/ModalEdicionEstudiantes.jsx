import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "./ModalEdicionEstudiante.css";

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
        setGrados([...new Set(asignaturasList.flatMap((a) => a.grado || []))]);
        setGrupos([...new Set(asignaturasList.flatMap((a) => a.grupo || []))]);
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
    if (!estudianteEditado.nombre.trim()) return alert("El nombre es obligatorio.");
    if (!estudianteEditado.direccion?.trim()) return alert("La dirección es obligatoria.");
    if (!estudianteEditado.telefono?.trim()) return alert("El teléfono es obligatorio.");
    if (!/^\d{8}$/.test(estudianteEditado.telefono)) return alert("El teléfono debe tener 8 dígitos.");
    if (!estudianteEditado.grado) return alert("Debe seleccionar un grado.");
    if (!estudianteEditado.grupo) return alert("Debe seleccionar un grupo.");
    if (!estudianteEditado.asignaturaId?.length) return alert("Debe seleccionar al menos una asignatura.");

    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      const updateData = {
        ...estudianteEditado,
        imagen: imagenBase64 || estudianteEditado.imagen || "",
      };

      await updateDoc(estudianteRef, updateData);
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("❌ Error al actualizar estudiante:", error);
    }
  };

  return (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      backdrop="static"
      keyboard={false}
      className="custom-modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={estudianteEditado.nombre || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={estudianteEditado.direccion || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={estudianteEditado.telefono || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,8}$/.test(value)) {
                  setEstudianteEditado((prev) => ({
                    ...prev,
                    telefono: value,
                  }));
                }
              }}
              placeholder="Número de teléfono (8 dígitos)"
              required
            />
            {estudianteEditado.telefono &&
              estudianteEditado.telefono.length !== 8 && (
                <Form.Text className="text-danger">
                  El número debe tener exactamente 8 dígitos.
                </Form.Text>
              )}
          </Form.Group>

          <Form.Group controlId="formTutor">
            <Form.Label>Tutor</Form.Label>
            <Form.Control
              type="text"
              name="tutor"
              value={estudianteEditado.tutor || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formGrado">
            <Form.Label>Grado</Form.Label>
            <Form.Select
              name="grado"
              value={estudianteEditado.grado || ""}
              onChange={handleInputChange}
              required
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
              value={estudianteEditado.grupo || ""}
              onChange={handleInputChange}
              required
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
            <Form.Label>Asignaturas</Form.Label>
            <Form.Select
              name="asignaturaId"
              multiple
              value={estudianteEditado.asignaturaId || []}
              onChange={handleAsignaturaChange}
              required
            >
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formImagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {(imagenBase64 || estudianteEditado.imagen) && (
              <img
                src={imagenBase64 || estudianteEditado.imagen}
                alt="Previsualización"
                className="preview-img"
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEstudiante;
