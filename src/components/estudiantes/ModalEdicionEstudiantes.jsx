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

        const allGrados = asignaturasList.flatMap((a) => a.grado || []);
        const allGrupos = asignaturasList.flatMap((a) => a.grupo || []);

        const uniqueGrados = [...new Set(allGrados)];
        const uniqueGrupos = [...new Set(allGrupos)];

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
    if (!estudianteEditado.id) return;

    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      const updateData = {
        ...estudianteEditado,
        imagen: imagenBase64 || estudianteEditado.imagen,
      };
      await updateDoc(estudianteRef, updateData);
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
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label className="fw-bold">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={estudianteEditado.nombre || ""}
              onChange={handleInputChange}
              placeholder="Nombre del estudiante"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido">
            <Form.Label className="fw-bold">Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={estudianteEditado.apellido || ""}
              onChange={handleInputChange}
              placeholder="Apellido del estudiante"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="carnet">
            <Form.Label className="fw-bold">Carnet</Form.Label>
            <Form.Control
              type="text"
              name="carnet"
              value={estudianteEditado.carnet || ""}
              onChange={handleInputChange}
              placeholder="Carnet del estudiante"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="correo">
            <Form.Label className="fw-bold">Correo</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={estudianteEditado.correo || ""}
              onChange={handleInputChange}
              placeholder="Correo electrónico"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="telefono">
            <Form.Label className="fw-bold">Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={estudianteEditado.telefono || ""}
              onChange={handleInputChange}
              placeholder="Número de teléfono"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="direccion">
            <Form.Label className="fw-bold">Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="direccion"
              value={estudianteEditado.direccion || ""}
              onChange={handleInputChange}
              placeholder="Dirección del estudiante"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="grado">
            <Form.Label className="fw-bold">Grado</Form.Label>
            <Form.Select
              name="grado"
              value={estudianteEditado.grado || ""}
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

          <Form.Group className="mb-3" controlId="grupo">
            <Form.Label className="fw-bold">Grupo</Form.Label>
            <Form.Select
              name="grupo"
              value={estudianteEditado.grupo || ""}
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

          <Form.Group className="mb-3" controlId="asignaturaId">
            <Form.Label className="fw-bold">Asignaturas</Form.Label>
            <Form.Select
              multiple
              name="asignaturaId"
              value={estudianteEditado.asignaturaId || []}
              onChange={handleAsignaturaChange}
            >
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Usa Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="imagen">
            <Form.Label className="fw-bold">Imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {estudianteEditado.imagen && (
              <img
                src={imagenBase64 || estudianteEditado.imagen}
                alt="Foto del estudiante"
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
