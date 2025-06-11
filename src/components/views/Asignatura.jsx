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
import { FaPlus } from "react-icons/fa";


// Componentes personalizados
import TablaAsignaturas from "../asignatura/TablaAsignatura";
import ModalRegistroAsignatura from "../asignatura/ModalRegistroAsignatura";
import ModalEdicionAsignatura from "../asignatura/ModalEdicionAsignatura";
import ModalEliminacionAsignatura from "../asignatura/ModalEliminacionAsignatura";
import Paginacion from "../ordenamiento/Paginacion"; // Ajusta la ruta si es necesario

const Asignatura = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: "",
    docente: "",
    grado: "",
    grupo: "",
  });
  const [asignaturaEditada, setAsignaturaEditada] = useState({
    nombre: "",
    docente: "",
    grado: "",
    grupo: "",
  });
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const asignaturasCollection = collection(db, "asignaturas");

  ReactGA.initialize("G-T4JNY83CWB");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Reiniciar a página 1 si se busca algo
  };

  const asignaturasFiltradas = asignaturas.filter((asignatura) =>
    ["nombre", "docente"].some((campo) =>
      asignatura[campo]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAsignaturas = asignaturasFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddAsignatura = async () => {
    try {
      const docRef = await addDoc(asignaturasCollection, nuevaAsignatura);
      setAsignaturas((prevState) => [
        ...prevState,
        { ...nuevaAsignatura, id: docRef.id },
      ]);
      setShowModal(false);
      setNuevaAsignatura({ nombre: "", docente: "", grado: "", grupo: "" });

      ReactGA.event({
        category: "Asignaturas",
        action: "Agregar Asignatura",
        label: nuevaAsignatura.nombre,
      });
    } catch (error) {
      console.error("Error al agregar asignatura:", error);
    }
  };

  const handleEditAsignatura = async () => {
    if (!asignaturaEditada.id) return;

    try {
      const asignaturaRef = doc(db, "asignaturas", asignaturaEditada.id);
      await updateDoc(asignaturaRef, { ...asignaturaEditada });
      fetchAsignaturas();
      setShowEditModal(false);

      ReactGA.event({
        category: "Asignaturas",
        action: "Editar Asignatura",
        label: asignaturaEditada.nombre,
      });
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
    }
  };

  const handleDeleteAsignatura = async () => {
    if (asignaturaAEliminar) {
      try {
        const asignaturaRef = doc(db, "asignaturas", asignaturaAEliminar.id);
        await deleteDoc(asignaturaRef);
        fetchAsignaturas();
        setShowDeleteModal(false);

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

    <Form.Control
      type="text"
      placeholder="Buscar"
      value={filtro}
      onChange={handleFiltroChange}
      className="mb-3"
    />

    <Button className="mb-3" onClick={() => setShowModal(true)}>
      <FaPlus />
    </Button>

    <TablaAsignaturas
      asignaturas={currentAsignaturas}
      openEditModal={(asignatura) => {
        setAsignaturaEditada(asignatura);
        setShowEditModal(true);
      }}
      openDeleteModal={(asignatura) => {
        setAsignaturaAEliminar(asignatura);
        setShowDeleteModal(true);
      }}
    />

    <Paginacion
      itemsPerPage={itemsPerPage}
      totalItems={asignaturasFiltradas.length}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
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
  asignaturaAEliminar={asignaturaAEliminar}
/>

  </Container>
);

};

export default Asignatura;
