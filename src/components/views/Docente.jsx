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
import Paginacion from "../ordenamiento/Paginacion";

const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docenteEditado, setDocenteEditado] = useState(null);
  const [docenteAEliminar, setDocenteAEliminar] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const docentesCollection = collection(db, "docentes");

  const fetchDocentes = async () => {
    try {
      const docentesSnapshot = await getDocs(collection(db, "docentes"));
      const asignaturasSnapshot = await getDocs(collection(db, "asignaturas"));

      const asignaturasMap = asignaturasSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[doc.id] = {
          docenteNombre: data.docente,
          nombreAsignatura: data.nombre,
        };
        return acc;
      }, {});

      const docentesList = docentesSnapshot.docs.map((doc) => {
        const data = doc.data();
        const asignatura = asignaturasMap[data.asignaturaId] || {};

        return {
          id: doc.id,
          titulo: data.titulo,
          direccion: data.direccion,
          telefono: data.telefono,
          imagen: data.imagen,
          docente: asignatura.docenteNombre || "Sin docente",
          asignaturaNombre: asignatura.nombreAsignatura || "Sin asignatura",
          asignaturaId: data.asignaturaId || "",
        };
      });

      setDocentes(docentesList);
    } catch (error) {
      console.error("❌ Error al obtener docentes:", error);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  ReactGA.initialize("G-T4JNY83CWB");

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Reiniciar página al filtrar
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
      docente: docente.docente || "",
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
    ["titulo", "direccion", "telefono", "docente", "asignaturaNombre"].some((campo) =>
      docente[campo]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocentes = docentesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(docentesFiltrados.length / itemsPerPage);

  return (
    <Container className="mt-5">
      <h4>Gestión de Docentes</h4>
      <Form.Control
        type="text"
        placeholder="Buscar por título, dirección, teléfono, docente o asignatura"
        value={filtro}
        onChange={handleFilterChange}
        className="mb-3"
      />
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar docente
      </Button>

      <TablaDocente
        docentes={currentDocentes}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Página {currentPage} de {totalPages}
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>{" "}
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>

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
        setDocenteEditado={setDocenteEditado}
        fetchData={fetchDocentes}
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
