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

import TablaDocente from "../docente/TablaDocente";
import ModalRegistroDocente from "../docente/ModalRegistroDocente";
import ModalEdicionDocente from "../docente/ModalEdicionDocente";
import ModalEliminacionDocente from "../docente/ModalEliminacionDocente";

const Docentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevoDocente, setNuevoDocente] = useState({
      titulo: "",
      direccion: "",
      telefono: "",
      imagen: "",
      asignaturaId: "",
    });
    const [docenteEditado, setDocenteEditado] = useState(null);
    const [docenteAEliminar, setDocenteAEliminar] = useState(null);
  
    const docentesCollection = collection(db, "docentes");
  
    const fetchDocentes = async () => {
      try {
        const docentesData = await getDocs(docentesCollection);
        setDocentes(docentesData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      }
    };
  
    useEffect(() => {
      fetchDocentes();
    }, []);
  
    ReactGA.initialize("G-T4JNY83CWB");
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNuevoDocente((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleFilterChange = (e) => {
      setFiltro(e.target.value);
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoDocente((prev) => ({
          ...prev,
          imagen: reader.result,
        }));
      };
      if (file) reader.readAsDataURL(file);
    };
  
    const handleEditImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocenteEditado((prev) => ({
          ...prev,
          imagen: reader.result,
        }));
      };
      if (file) reader.readAsDataURL(file);
    };
  
    const openEditModal = (docente) => {
      if (!docente) return;
      setDocenteEditado({
        id: docente.id,
        titulo: docente.titulo || "",
        direccion: docente.direccion || "",
        telefono: docente.telefono || "",
        imagen: docente.imagen || "",
        asignaturaId: docente.asignaturaId || "",
        docente: docente.docente || "", // 🔥 Necesario si se está usando para filtrar
      });
      setShowEditModal(true);
    };
  
    const openDeleteModal = (docente) => {
      setDocenteAEliminar(docente);
      setShowDeleteModal(true);
    };
  
    const handleAddDocente = async (nuevoDocente) => {
      if (!nuevoDocente.titulo?.trim()) {
        alert("Por favor, completa el campo de título.");
        return;
      }
  
      try {
        await addDoc(docentesCollection, nuevoDocente);
        alert("Docente agregado correctamente.");
        await fetchDocentes();
      } catch (error) {
        console.error("Error al agregar docente:", error);
      }
    };
  
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setDocenteEditado((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleEditDocente = async () => {
      if (!docenteEditado || !docenteEditado.titulo?.trim()) {
        alert("Por favor, completa el campo de título.");
        return;
      }
  
      try {
        const docenteRef = doc(db, "docentes", docenteEditado.id);
        const updateData = {
          titulo: docenteEditado.titulo,
          direccion: docenteEditado.direccion,
          telefono: docenteEditado.telefono,
          asignaturaId: docenteEditado.asignaturaId,
        };
  
        if (docenteEditado.imagen) {
          updateData.imagen = docenteEditado.imagen;
        }
  
        await updateDoc(docenteRef, updateData);
  
        ReactGA.event({
          category: "Docentes",
          action: "Edición de Docente",
          label: docenteEditado.titulo,
          value: 1,
        });
  
        setShowEditModal(false);
        await fetchDocentes();
      } catch (error) {
        console.error("Error al editar el docente:", error);
      }
    };
  
    const handleDeleteDocente = async () => {
      if (docenteAEliminar) {
        try {
          const docenteRef = doc(db, "docentes", docenteAEliminar.id);
          await deleteDoc(docenteRef);
  
          ReactGA.event({
            category: "Docentes",
            action: "Eliminación de Docente",
            label: docenteAEliminar.titulo,
            value: 1,
          });
  
          setShowDeleteModal(false);
          await fetchDocentes();
        } catch (error) {
          console.error("Error al eliminar el docente:", error);
        }
      }
    };
  
    const docentesFiltrados = docentes.filter((docente) =>
      ["titulo", "direccion", "telefono"].some((campo) =>
        docente[campo]?.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  
    return (
      <Container className="mt-5">
        <h4>Gestión de Docentes</h4>
        <Form.Control
          type="text"
          placeholder="Buscar"
          value={filtro}
          onChange={handleFilterChange}
          className="mb-3"
        />
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          Agregar docente
        </Button>
        <TablaDocente
          docentes={docentesFiltrados}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
        <ModalRegistroDocente
          showModal={showModal}
          setShowModal={setShowModal}
          fetchDocentes={fetchDocentes}
          handleAddDocente={handleAddDocente}
        />
        <ModalEdicionDocente
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          docenteEditado={docenteEditado}
          setDocenteEditado={setDocenteEditado} // ✅ Agregado
          fetchData={fetchDocentes}            // ✅ Agregado
        />
        <ModalEliminacionDocente
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteDocente={handleDeleteDocente}
          docenteAEliminar={docenteAEliminar}
        />
      </Container>
    );
  };
  
  export default Docentes;