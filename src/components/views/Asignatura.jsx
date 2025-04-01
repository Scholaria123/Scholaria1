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
  });
  const [asignaturaEditada, setAsignaturaEditada] = useState({
    nombre: "",
    docente: "",
  });
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null);

  const asignaturasCollection = collection(db, "asignaturas");

  // Obtener asignaturas de Firestore
  const fetchAsignaturas = async () => {
    const querySnapshot = await getDocs(collection(db, "asignaturas"));
    const asignaturasArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAsignaturas(asignaturasArray);
  };

  useEffect(() => {
    const fetchAsignaturas = async () => {
      const querySnapshot = await getDocs(collection(db, "asignaturas"));
      setAsignaturas(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
  
    fetchAsignaturas();
  }, []);

  // Manejador de cambios en los inputs para la nueva asignatura
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Agregar nueva asignatura (CREATE)
  const handleAddAsignatura = async () => {
    try {
      const docRef = await addDoc(collection(db, "asignaturas"), nuevaAsignatura);
      console.log("Asignatura agregada correctamente");
  
      // Después de agregar, actualiza el estado para incluir la nueva asignatura
      setAsignaturas((prevState) => [
        ...prevState,
        { ...nuevaAsignatura, id: docRef.id },  // Incluye el ID generado en Firestore
      ]);
  
      // Cierra el modal y limpia los campos
      setShowModal(false);
      setNuevaAsignatura({
        nombre: "",
        docente: "",
      });
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
      await updateDoc(asignaturaRef, { ...asignaturaEditada });
      console.log("Asignatura actualizada correctamente");
  
      // 🚀 Vuelve a obtener todas las asignaturas después de actualizar
      const querySnapshot = await getDocs(collection(db, "asignaturas"));
      const asignaturasActualizadas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setAsignaturas(asignaturasActualizadas); // 🔥 Actualiza el estado global de asignaturas
  
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
        <Button onClick={() => setShowModal(true)}>Agregar Asignatura</Button>
        
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
  handleEditAsignatura={handleEditAsignatura}  // 🚀 PASAR LA FUNCIÓN AQUÍ
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
