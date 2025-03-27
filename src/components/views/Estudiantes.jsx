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
    grado: "",
    grupo: "",
    direccion: "",
    telefono: "",
    imagen: "",
  });
  const [estudianteEditado, setEstudianteEditado] = useState(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);

  const estudiantesCollection = collection(db, "estudiantes");

  // Obtener estudiantes
  const fetchEstudiantes = async () => {
    try {
      const data = await getDocs(estudiantesCollection);
      const fetchedEstudiantes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Estudiantes obtenidos:", fetchedEstudiantes); // Para revisar los datos
      setEstudiantes(fetchedEstudiantes);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  };
  
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Imagen editada (base64):", reader.result); // Imprime la imagen base64 para depuración
      setEstudianteEditado((prev) => ({
        ...prev,
        imagen: reader.result,  // Asegúrate que la imagen se guarde en base64
      }));
    };
    if (file) reader.readAsDataURL(file);
  };
  

  // Manejo de cambios en la imagen (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNuevoEstudiante((prev) => ({
        ...prev,
        imagen: reader.result, // Se guarda la imagen como Base64
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  // Modal de edición
  const openEditModal = (estudiante) => {
    // Verifica que `estudiante` tenga los datos correctos
    if (!estudiante) {
      console.error("No se ha encontrado el estudiante.");
      return;
    }
  
    setEstudianteEditado({
      id: estudiante.id,
      nombre: estudiante.nombre || "",
      grado: estudiante.grado || "",
      grupo: estudiante.grupo || "",
      direccion: estudiante.direccion || "",
      telefono: estudiante.telefono || "",
      imagen: estudiante.imagen || "", // Puede estar vacío o null
    });
    setShowEditModal(true);
  };
  // Modal de eliminación
  const openDeleteModal = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteModal(true);
  };

  // Agregar estudiante
  const handleAddEstudiante = async () => {
    // Verifica los datos antes de intentar agregarlos
    console.log("Datos del nuevo estudiante:", JSON.stringify(nuevoEstudiante, null, 2));
  
    if (!nuevoEstudiante.nombre?.trim() || !nuevoEstudiante.grado?.trim() || !nuevoEstudiante.grupo?.trim()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    try {
      await addDoc(estudiantesCollection, nuevoEstudiante);
      alert("Estudiante agregado correctamente.");
      setShowModal(false);
      setNuevoEstudiante({ nombre: "", grado: "", grupo: "", direccion: "", telefono: "", imagen: "" });
      fetchEstudiantes();
    } catch (error) {
      // Muestra el error completo en la consola para poder depurarlo
      console.error("Error al agregar estudiante:", error);
      alert("Error al agregar estudiante.");
    }
  };
  
  

  // Manejo de cambios en los inputs de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleEditEstudiante = async () => {
    if (!estudianteEditado || !estudianteEditado.nombre?.trim() || !estudianteEditado.grado?.trim() || !estudianteEditado.grupo?.trim()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      
      const updateData = {
        nombre: estudianteEditado.nombre,
        grado: estudianteEditado.grado,
        grupo: estudianteEditado.grupo,
        direccion: estudianteEditado.direccion,
        telefono: estudianteEditado.telefono,
      };
  
      // Solo actualiza la imagen si se ha cambiado
      if (estudianteEditado.imagen !== estudianteEditado.imagenOriginal) {
        updateData.imagen = estudianteEditado.imagen;
      }
  
      await updateDoc(estudianteRef, updateData);
      setShowEditModal(false);
      fetchEstudiantes();
      alert("Estudiante actualizado correctamente.");
    } catch (error) {
      console.error("Error al editar el estudiante:", error);
      alert("Error al actualizar el estudiante.");
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
      />
    <ModalEdicionEstudiante
  showEditModal={showEditModal}
  setShowEditModal={setShowEditModal}
  estudianteEditado={estudianteEditado}
  handleEditInputChange={handleEditInputChange}
  handleEditImageChange={handleEditImageChange} // Asegúrate de pasar la función
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