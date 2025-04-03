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
import ReactGA from "react-ga4";

// Importaciones de componentes personalizados
import TablaAsignaturas from "../asignatura/TablaAsignatura";
import ModalRegistroAsignatura from "../asignatura/ModalRegistroAsignatura";
import ModalEdicionAsignatura from "../asignatura/ModalEdicionAsignatura";
import ModalEliminacionAsignatura from "../asignatura/ModalEliminacionAsignatura";

const Asignatura = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [filtro, setFiltro] = useState(""); // Estado para la búsqueda
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: '',
    docente: '',
    grado: '',
    grupo: '',
  });
  const [asignaturaEditada, setAsignaturaEditada] = useState({
    nombre: "",
    docente: "",
    grado: "",
    grupo: "",
  });
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null);

  const asignaturasCollection = collection(db, "asignaturas");

  // Inicialización de Google Analytics
  ReactGA.initialize("G-T4JNY83CWB"); // Reemplaza con tu ID de seguimiento

  // Obtener asignaturas de Firestore
  const fetchAsignaturas = async () => {
    const querySnapshot = await getDocs(asignaturasCollection);
    const asignaturasArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAsignaturas(asignaturasArray);
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejador de la búsqueda
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  // Filtrar asignaturas por nombre y docente
  const asignaturasFiltradas = asignaturas.filter((asignatura) =>
    (asignatura.nombre && asignatura.nombre.toLowerCase().includes(filtro.toLowerCase())) ||
    (asignatura.docente && asignatura.docente.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Agregar nueva asignatura
  const handleAddAsignatura = async () => {
    try {
      const docRef = await addDoc(asignaturasCollection, nuevaAsignatura);
      setAsignaturas((prevState) => [
        ...prevState,
        { ...nuevaAsignatura, id: docRef.id },
      ]);
      setShowModal(false);
      setNuevaAsignatura({ nombre: "", docente: "", grado: "", grupo: "" });
      
      // Evento de Google Analytics para agregar asignatura
      ReactGA.event({
        category: "Asignaturas",
        action: "Agregar Asignatura",
        label: nuevaAsignatura.nombre,
      });

    } catch (error) {
      console.error("Error al agregar asignatura:", error);
    }
  };

  // Actualizar asignatura
  const handleEditAsignatura = async () => {
    if (!asignaturaEditada.id) return;

    try {
      const asignaturaRef = doc(db, "asignaturas", asignaturaEditada.id);
      await updateDoc(asignaturaRef, { ...asignaturaEditada });
      fetchAsignaturas();
      setShowEditModal(false);
      
      // Evento de Google Analytics para editar asignatura
      ReactGA.event({
        category: "Asignaturas",
        action: "Editar Asignatura",
        label: asignaturaEditada.nombre,
      });

    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
    }
  };

  // Eliminar asignatura
  const handleDeleteAsignatura = async () => {
    if (asignaturaAEliminar) {
      try {
        const asignaturaRef = doc(db, "asignaturas", asignaturaAEliminar.id);
        await deleteDoc(asignaturaRef);
        fetchAsignaturas();
        setShowDeleteModal(false);
        
        // Evento de Google Analytics para eliminar asignatura
        ReactGA.event({
          category: "Asignaturas",
          action: "Eliminar Asignatura",
          label: asignaturaAEliminar.nombre,
        });

      } catch (error) {
        console.error("Error al eliminar la asignatura:", error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Asignaturas</h4>
      
      {/* Campo de búsqueda */}
      <Form.Control
        type="text"
        placeholder="Buscar"
        value={filtro}
        onChange={handleFiltroChange}
        className="mb-3"
      />

      <Button onClick={() => setShowModal(true)}>Agregar Asignatura</Button>

      <TablaAsignaturas
        asignaturas={asignaturasFiltradas}
        openEditModal={(asignatura) => {
          setAsignaturaEditada(asignatura);
          setShowEditModal(true);
        }}
        openDeleteModal={(asignatura) => {
          setAsignaturaAEliminar(asignatura);
          setShowDeleteModal(true);
        }}
      />

      <ModalRegistroAsignatura
        showModal={showModal}
        setShowModal={setShowModal}
        nuevaAsignatura={nuevaAsignatura}
        handleInputChange={handleInputChange}
        handleAddAsignatura={handleAddAsignatura}
      />

      <ModalEdicionAsignatura
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        asignaturaEditada={asignaturaEditada}
        setAsignaturaEditada={setAsignaturaEditada}
        handleEditAsignatura={handleEditAsignatura}
      />

      <ModalEliminacionAsignatura
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteAsignatura={handleDeleteAsignatura}
      />
    </Container>
  );
};

export default Asignatura;
