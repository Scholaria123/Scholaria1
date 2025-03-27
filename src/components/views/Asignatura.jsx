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
    nombre: '',
    docente: '',
    grado: '',
    grupo: '',
    estudiante: '',
    nota: '',
  });
  const [asignaturaEditada, setAsignaturaEditada] = useState({
    nombre: "",
    docente: "",
    grado: "",
    grupo: "",
    estudiante: "",
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
    setAsignaturaEditada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Agregar nueva asignatura (CREATE)
  const handleAddAsignatura = async () => {
    try {
      await addDoc(collection(db, "asignaturas"), nuevaAsignatura);
      console.log("Asignatura agregada correctamente");
      setShowModal(false); // Cierra el modal después de agregar
    } catch (error) {
      console.error("Error al agregar asignatura:", error);
    }
  };

  // Actualizar asignatura (UPDATE)
  const handleEditAsignatura = async () => {
    if (!asignaturaEditada.id) {
      console.error("Error: La asignatura no tiene un ID");
      return;
    }

    const asignaturaRef = doc(db, "asignaturas", asignaturaEditada.id);

    try {
      await updateDoc(asignaturaRef, asignaturaEditada);
      console.log("Asignatura actualizada correctamente");

      // ACTUALIZAR LISTA SIN RECARGAR PÁGINA
      setAsignaturas((prevAsignaturas) =>
        prevAsignaturas.map((asig) =>
          asig.id === asignaturaEditada.id ? asignaturaEditada : asig
        )
      );

      setShowEditModal(false);
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
    setAsignaturaEditada(asignatura);
    setShowEditModal(true);
  };

  const openDeleteModal = (asignatura) => {
    setAsignaturaAEliminar(asignatura);
    setShowDeleteModal(true);
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Asignaturas</h4>
      <div>
        <button onClick={() => setShowModal(true)}>Agregar Asignatura</button>
        
        {/* Modal de Registro */}
        <ModalRegistroAsignatura
          showModal={showModal}
          setShowModal={setShowModal}
          nuevaAsignatura={nuevaAsignatura}
          handleInputChange={handleInputChange}
          handleAddAsignatura={handleAddAsignatura}
        />
      </div>

      <TablaAsignaturas
        asignaturas={asignaturas}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      <ModalEdicionAsignatura
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        asignaturaEditada={asignaturaEditada}
        setAsignaturaEditada={setAsignaturaEditada}
        setAsignaturas={setAsignaturas} // Pasar la función setAsignaturas
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
