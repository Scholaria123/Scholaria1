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
  
// Importaciones de componentes personalizados
import TablaEstudiantes from "../estudiantes/TablaEstudiantes";
import ModalRegistroEstudiante from "../estudiantes/ModalRegistroEstudiantes";
import ModalEdicionEstudiante from "../estudiantes/ModalEdicionEstudiantes";
import ModalEliminacionEstudiante from "../estudiantes/ModalEliminacionEstudiantes";

const Estudiantes = () => {
  
  // Estados para manejo de datos
  const [estudiantes, setEstudiantes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    asignatura: "",
    imagen: "",
  });
  const [estudianteEditado, setEstudianteEditado] = useState(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);

  // Referencia a la colección de estudiantes en Firestore
  const estudiantesCollection = collection(db, "estudiantes");

  // Función para obtener todos los estudiantes de Firestore
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

  // Hook useEffect para carga inicial de datos
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  // Manejador de cambios en inputs del formulario de nuevo estudiante
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para la carga de imágenes en nuevo estudiante
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoEstudiante((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador de cambios en inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para la carga de imágenes en edición
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEstudianteEditado((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para agregar un nuevo estudiante (CREATE)
  const handleAddEstudiante = async () => {
    if (!nuevoEstudiante.nombre.trim() || !nuevoEstudiante.asignatura.trim()) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    
    try {
      await addDoc(estudiantesCollection, nuevoEstudiante);
      setShowModal(false);
      setNuevoEstudiante({ nombre: "", asignatura: "", imagen: "" });
      await fetchEstudiantes();
    } catch (error) {
      console.error("Error al agregar el estudiante:", error);
    }
  };

  // Función para actualizar un estudiante existente (UPDATE)
  const handleEditEstudiante = async () => {
    if (!estudianteEditado.nombre || !estudianteEditado.asignatura) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      await updateDoc(estudianteRef, estudianteEditado);
      setShowEditModal(false);
      await fetchEstudiantes();
    } catch (error) {
      console.error("Error al actualizar el estudiante:", error);
    }
  };

  // Función para eliminar un estudiante (DELETE)
  const handleDeleteEstudiante = async () => {
    if (estudianteAEliminar) {
      try {
        const estudianteRef = doc(db, "estudiantes", estudianteAEliminar.id);
        await deleteDoc(estudianteRef);
        setShowDeleteModal(false);
        await fetchEstudiantes();
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
      }
    }
  };

  // Función para abrir el modal de edición con datos prellenados
  const openEditModal = (estudiante) => {
    setEstudianteEditado({ ...estudiante });
    setShowEditModal(true);
  };

  // Función para abrir el modal de eliminación
  const openDeleteModal = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteModal(true);
  };

  // Renderizado del componente
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
      />
      <ModalEdicionEstudiante
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        estudianteEditado={estudianteEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditImageChange={handleEditImageChange}
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
