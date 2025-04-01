import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig"; // Asegúrate de que la ruta es correcta
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const ModalEdicionEstudiante = ({
  showEditModal,
  setShowEditModal,
  estudianteEditado,
  setEstudianteEditado, // ✅ Verificamos que esta función exista
  fetchData, // ✅ Función para actualizar la lista después de editar
}) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

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

  if (!estudianteEditado) return null; // ✅ Previene errores si `estudianteEditado` es `null`

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({ ...prev, [name]: value })); // ✅ Ahora sí se ejecuta correctamente
  };

  const handleSaveChanges = async () => {
    if (!estudianteEditado.id) {
      console.error("❌ No hay ID del estudiante para actualizar.");
      return;
    }
  
    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
  
      // Crear objeto de actualización solo con los valores definidos
      const updateData = Object.fromEntries(
        Object.entries(estudianteEditado).filter(([_, value]) => value !== undefined && value !== "")
      );
  
      await updateDoc(estudianteRef, updateData);
  
      console.log("✅ Estudiante actualizado correctamente");
      fetchData(); // Recargar lista después de editar
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
            <Form.Label>Asignatura</Form.Label>
            <Form.Select name="asignaturaId" value={estudianteEditado.asignaturaId || ""} onChange={handleInputChange}>
              <option value="">Seleccione una asignatura</option>
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </Form.Select>
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