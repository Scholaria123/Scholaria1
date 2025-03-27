import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import TablaEstudiantes from "../estudiantes/TablaEstudiantes";
import ModalRegistroEstudiante from "../estudiantes/ModalRegistroEstudiantes";
import ModalEdicionEstudiante from "../estudiantes/ModalEdicionEstudiantes";
import ModalEliminacionEstudiante from "../estudiantes/ModalEliminacionEstudiantes";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    asignatura: "", 
    imagen: null,
  });
  const [estudianteEditado, setEstudianteEditado] = useState(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);

  const estudiantesCollection = collection(db, "estudiantes");
  const asignaturasCollection = collection(db, "asignaturas");

  // Obtener estudiantes
  const fetchEstudiantes = async () => {
    try {
      const data = await getDocs(estudiantesCollection);
      const fetchedEstudiantes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEstudiantes(fetchedEstudiantes);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  };

  // Obtener asignaturas
  const fetchAsignaturas = async () => {
    try {
      const data = await getDocs(asignaturasCollection);
      const asignaturasList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAsignaturas(asignaturasList);
    } catch (error) {
      console.error("Error al obtener asignaturas:", error);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
    fetchAsignaturas();
  }, []);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo de cambios en la imagen (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNuevoEstudiante((prev) => ({
        ...prev,
        imagen: reader.result,
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  // Modal de edición
  const openEditModal = (estudiante) => {
    setEstudianteEditado({ ...estudiante });
    setShowEditModal(true);
  };

  // Modal de eliminación
  const openDeleteModal = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteModal(true);
  };

  // Agregar estudiante
  const handleAddEstudiante = async () => {
    if (!nuevoEstudiante.nombre || !nuevoEstudiante.asignatura) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const asignaturaSeleccionada = asignaturas.find(
      (asignatura) => asignatura.id === nuevoEstudiante.asignatura
    );
    if (asignaturaSeleccionada) {
      const estudianteConAsignatura = {
        ...nuevoEstudiante,
        asignaturaNombre: asignaturaSeleccionada.nombre,
      };
      try {
        await addDoc(estudiantesCollection, estudianteConAsignatura);
        alert("Estudiante agregado correctamente.");
        setShowModal(false);
        setNuevoEstudiante({ nombre: "", asignatura: "", imagen: null });
        fetchEstudiantes();
      } catch (error) {
        console.error("Error al agregar estudiante:", error);
        alert("Error al agregar estudiante.");
      }
    }
  };

  // Editar estudiante
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditEstudiante = async () => {
    if (!estudianteEditado.nombre || !estudianteEditado.asignatura) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const asignaturaSeleccionada = asignaturas.find(
      (asignatura) => asignatura.id === estudianteEditado.asignatura
    );
    if (asignaturaSeleccionada) {
      const estudianteConAsignatura = {
        ...estudianteEditado,
        asignaturaNombre: asignaturaSeleccionada.nombre,
      };
      try {
        const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
        await updateDoc(estudianteRef, estudianteConAsignatura);
        setShowEditModal(false);
        fetchEstudiantes();
      } catch (error) {
        console.error("Error al editar el estudiante:", error);
      }
    }
  };

  // Eliminar estudiante
  const handleDeleteEstudiante = async () => {
    if (estudianteAEliminar) {
      try {
        const estudianteRef = doc(db, "estudiantes", estudianteAEliminar.id);
        await deleteDoc(estudianteRef);
        setShowDeleteModal(false);
        fetchEstudiantes();
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Gestión de Estudiantes</h4>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar estudiante
      </Button>
      <TablaEstudiantes
        estudiantes={estudiantes}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
      <ModalRegistroEstudiante
        showModal={showModal}
        setShowModal={setShowModal}
        nuevoEstudiante={nuevoEstudiante}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddEstudiante={handleAddEstudiante}
        asignaturas={asignaturas}
      />
      <ModalEdicionEstudiante
  showEditModal={showEditModal}
  setShowEditModal={setShowEditModal}
  estudianteEditado={estudianteEditado}
  handleEditInputChange={(e) => setEstudianteEditado({...estudianteEditado, [e.target.name]: e.target.value})} // ✅ Actualiza correctamente
  handleEditImageChange={handleImageChange}
  handleEditEstudiante={handleEditEstudiante}
/>
      <ModalEliminacionEstudiante
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteEstudiante={handleDeleteEstudiante}
      />
    </Container>
  );
};

export default Estudiantes;
