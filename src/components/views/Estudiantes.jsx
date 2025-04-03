import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
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
  const [filtro, setFiltro] = useState(""); // Estado para el término de búsqueda
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    imagen: "",
  });
  const [estudianteEditado, setEstudianteEditado] = useState(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);

  const estudiantesCollection = collection(db, "estudiantes");

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

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEstudianteEditado((prev) => ({
        ...prev,
        imagen: reader.result,
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

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

  const openEditModal = (estudiante) => {
    if (!estudiante) {
      console.error("No se ha encontrado el estudiante.");
      return;
    }

    setEstudianteEditado({
      id: estudiante.id,
      nombre: estudiante.nombre || "",
      direccion: estudiante.direccion || "",
      telefono: estudiante.telefono || "",
      imagen: estudiante.imagen || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (estudiante) => {
    setEstudianteAEliminar(estudiante);
    setShowDeleteModal(true);
  };

  const handleAddEstudiante = async () => {
    if (!nuevoEstudiante.nombre?.trim()) {
      alert("Por favor, completa el campo de nombre.");
      return;
    }
    try {
      await addDoc(estudiantesCollection, nuevoEstudiante);
      alert("Estudiante agregado correctamente.");
      setShowModal(false);
      setNuevoEstudiante({ nombre: "", direccion: "", telefono: "", imagen: "" });
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
      alert("Error al agregar estudiante.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditEstudiante = async () => {
    if (!estudianteEditado || !estudianteEditado.nombre?.trim()) {
      alert("Por favor, completa el campo de nombre.");
      return;
    }

    try {
      const estudianteRef = doc(db, "estudiantes", estudianteEditado.id);
      
      const updateData = {
        nombre: estudianteEditado.nombre,
        direccion: estudianteEditado.direccion,
        telefono: estudianteEditado.telefono,
      };

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

  // Filtrar estudiantes según el término de búsqueda
  const estudiantesFiltrados = estudiantes.filter((estudiante) =>
    ["nombre", "direccion", "telefono"].some((campo) =>
      estudiante[campo]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  return (
    <Container className="mt-5">
      <br />
      <h4>Gestión de Estudiantes</h4>
      <Form.Control
        type="text"
        placeholder="Buscar"
        value={filtro}
        onChange={handleFilterChange}
        className="mb-3"
      />
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar estudiante
      </Button>
      <TablaEstudiantes
        estudiantes={estudiantesFiltrados}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
      <ModalRegistroEstudiante
        showModal={showModal}
        setShowModal={setShowModal}
        fetchEstudiantes={fetchEstudiantes}
        nuevoEstudiante={nuevoEstudiante}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddEstudiante={handleAddEstudiante}
      />
      <ModalEdicionEstudiante
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        estudianteEditado={estudianteEditado}
        setEstudianteEditado={setEstudianteEditado}
        fetchData={fetchEstudiantes}
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
