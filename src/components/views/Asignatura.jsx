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
import TablaAsignaturas from "../asignatura/TablaAsignatura";
import ModalRegistroAsignatura from "../asignatura/ModalRegistroAsignatura";
import ModalEdicionAsignatura from "../asignatura/ModalEdicionAsignatura";
import ModalEliminacionAsignatura from "../asignatura/ModalEliminacionAsignatura";

const Asignatura = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: "",
    docente: "",
    grado: "",
    nota: "",
  });
  const [asignaturaEditada, setAsignaturaEditada] = useState({
    nombre: "",
    docente: "",
    grado: "",
    nota: "",
  });
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null);

  const asignaturasCollection = collection(db, "asignaturas");

  // Obtener asignaturas de Firestore
  const fetchAsignaturas = async () => {
    try {
      const data = await getDocs(asignaturasCollection);
      const fetchedAsignaturas = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAsignaturas(fetchedAsignaturas);
    } catch (error) {
      console.error("Error al obtener las asignaturas:", error);
    }
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura((prev) => ({
      ...prev,
      [name]: value, // Actualiza el estado de nuevaAsignatura con el valor cambiado
    }));
  }
  

  // Agregar nueva asignatura (CREATE)
  const handleAddAsignatura = async () => {
    if (!nuevaAsignatura.nombre.trim() || !nuevaAsignatura.docente.trim() || !nuevaAsignatura.grado.trim() || !nuevaAsignatura.nota.trim()) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
  
    try {
      console.log("Datos que se agregarán:", nuevaAsignatura);  // Verificar los datos antes de enviarlos a Firestore
      await addDoc(asignaturasCollection, nuevaAsignatura);
      setShowModal(false);
      setNuevaAsignatura({ nombre: "", docente: "", grado: "", nota: "" });
      await fetchAsignaturas();
    } catch (error) {
      console.error("Error al agregar la asignatura:", error);
    }
  };

  // Actualizar asignatura (UPDATE)
  const handleEditAsignatura = async () => {
    if (!asignaturaEditada.nombre || !asignaturaEditada.docente || !asignaturaEditada.grado || !asignaturaEditada.nota) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    try {
      const asignaturaRef = doc(db, "asignaturas", asignaturaEditada.id);
      await updateDoc(asignaturaRef, asignaturaEditada);
      setShowEditModal(false);
      await fetchAsignaturas();
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
    }
  };

  // Eliminar asignatura (DELETE)
  const handleDeleteAsignatura = async () => {
    if (asignaturaAEliminar) {
      try {
        const asignaturaRef = doc(db, "asignaturas", asignaturaAEliminar.id);
        await deleteDoc(asignaturaRef);
        setShowDeleteModal(false);
        await fetchAsignaturas();
      } catch (error) {
        console.error("Error al eliminar la asignatura:", error);
      }
    }
  };

  const openEditModal = (asignatura) => {
    setAsignaturaEditada({ ...asignatura });
    setShowEditModal(true);
  };

  const openDeleteModal = (asignatura) => {
    setAsignaturaAEliminar(asignatura);
    setShowDeleteModal(true);
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Asignaturas</h4>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar asignatura
      </Button>
      <TablaAsignaturas
        asignaturas={asignaturas}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
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
        handleInputChange={handleInputChange}
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
