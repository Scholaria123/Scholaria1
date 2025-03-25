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
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    asignatura: "",  // Este debe ser el id de la asignatura
    imagen: null,
  });
  
  
  const [estudianteEditado, setEstudianteEditado] = useState(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);

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

  useEffect(() => {
    // Simulación de carga de datos
    setAsignaturas([
      { id: '1', nombre: 'Matemáticas' },
      { id: '2', nombre: 'Ciencias' },
      { id: '3', nombre: 'Geografía' },
    ]);
  }, []);

  // Funciones de manejo de formularios
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,  // Actualiza el estado con el nuevo valor
    }));
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    // Crear un FileReader para leer el archivo
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64Image = reader.result; // Aquí obtenemos la imagen en Base64
  
      // Actualizamos el estado con la imagen en Base64
      setNuevoEstudiante((prev) => ({
        ...prev,
        imagen: base64Image, // Guardamos la imagen en Base64
      }));
    };
  
    if (file) {
      reader.readAsDataURL(file); // Esto convierte el archivo en Base64
    }
  };
  

  const openEditModal = (estudiante) => {
    setEstudianteEditado({ ...estudiante });
    setShowEditModal(true);
  };

  const openDeleteModal = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteModal(true);
  };
  
  const handleAddEstudiante = async () => {
    if (!nuevoEstudiante.nombre || !nuevoEstudiante.asignatura) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Buscar la asignatura seleccionada por su ID
    const asignaturaSeleccionada = asignaturas.find(
      (asignatura) => asignatura.id === nuevoEstudiante.asignatura
    );
  
    if (asignaturaSeleccionada) {
      // Crear el objeto del estudiante con el nombre de la asignatura
      const estudianteConAsignatura = {
        nombre: nuevoEstudiante.nombre,
        asignatura: nuevoEstudiante.asignatura, // ID de la asignatura
        asignaturaNombre: asignaturaSeleccionada.nombre, // Nombre de la asignatura
        imagen: nuevoEstudiante.imagen || null,
      };
  
      try {
        await addDoc(estudiantesCollection, estudianteConAsignatura);
        alert("Estudiante agregado correctamente.");
        setShowModal(false);
        fetchEstudiantes(); // Refrescar la lista
      } catch (error) {
        console.error("Error al agregar estudiante:", error);
        alert("Error al agregar estudiante.");
      }
    }
  };  
  
  const handleEditEstudiante = async () => {
    if (!estudianteEditado.nombre || !estudianteEditado.asignatura) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Encontrar el nombre de la asignatura por el id
    const asignaturaSeleccionada = asignaturas.find(
      (asignatura) => asignatura.id === estudianteEditado.asignatura
    );
  
    if (asignaturaSeleccionada) {
      // Ahora puedes actualizar el estudiante con el nombre de la asignatura
      const estudianteConAsignatura = {
        ...estudianteEditado,
        asignaturaNombre: asignaturaSeleccionada.nombre, // Agregar el nombre de la asignatura
      };
  
      // Llamar a la función que actualizará el estudiante en la base de datos
      try {
        const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
        await updateDoc(estudianteRef, estudianteConAsignatura);
        setShowEditModal(false);
        await fetchEstudiantes(); // Recargar la lista de estudiantes
      } catch (error) {
        console.error("Error al editar el estudiante:", error);
      }
    }
  };
  

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
  handleInputChange={handleInputChange}
  handleImageChange={handleImageChange}
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
  