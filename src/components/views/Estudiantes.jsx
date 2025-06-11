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
import { useNavigate } from "react-router-dom";
import TablaEstudiantes from "../estudiantes/TablaEstudiantes";
import ModalRegistroEstudiante from "../estudiantes/ModalRegistroEstudiantes";
import ModalEdicionEstudiante from "../estudiantes/ModalEdicionEstudiantes";
import ModalEliminacionEstudiante from "../estudiantes/ModalEliminacionEstudiantes";
import Paginacion from "../ordenamiento/Paginacion";
import "./Estudiantes.css";
import { FaUserPlus, FaClipboardList, FaTrash } from "react-icons/fa";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtro, setFiltro] = useState("");
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
  const [verPapelera, setVerPapelera] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const estudiantesCollection = collection(db, "estudiantes");

  useEffect(() => {
    fetchEstudiantes();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
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

  const openEditModal = (estudiante) => {
    if (!estudiante) return;
    setEstudianteEditado({ ...estudiante });
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
      await addDoc(estudiantesCollection, {
        ...nuevoEstudiante,
        eliminado: false,
      });
      ReactGA.event({
        category: "Estudiantes",
        action: "Registro de Estudiante",
        label: nuevoEstudiante.nombre,
        value: 1,
      });
      setShowModal(false);
      setNuevoEstudiante({ nombre: "", direccion: "", telefono: "", imagen: "" });
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
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
        imagen: estudianteEditado.imagen,
      };
      await updateDoc(estudianteRef, updateData);
      ReactGA.event({
        category: "Estudiantes",
        action: "Edición de Estudiante",
        label: estudianteEditado.nombre,
        value: 1,
      });
      setShowEditModal(false);
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al actualizar el estudiante:", error);
    }
  };

  const handleDeleteEstudiante = async () => {
    if (estudianteAEliminar) {
      try {
        const estudianteRef = doc(db, "estudiantes", estudianteAEliminar.id);
        await updateDoc(estudianteRef, { eliminado: true });
        ReactGA.event({
          category: "Estudiantes",
          action: "Eliminación lógica de Estudiante",
          label: estudianteAEliminar.nombre,
          value: 1,
        });
        setShowDeleteModal(false);
        setCurrentPage(1);
        fetchEstudiantes();
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
      }
    }
  };

  const restaurarEstudiante = async (id) => {
    try {
      const estudianteRef = doc(db, "estudiantes", id);
      await updateDoc(estudianteRef, { eliminado: false });
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al restaurar estudiante:", error);
    }
  };

  const eliminarDefinitivamente = async (id) => {
    try {
      const estudianteRef = doc(db, "estudiantes", id);
      await deleteDoc(estudianteRef);
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al eliminar permanentemente:", error);
    }
  };

  const estudiantesFiltrados = estudiantes
    .filter((est) => verPapelera ? est.eliminado : !est.eliminado)
    .filter((estudiante) =>
      ["nombre", "direccion", "telefono"].some((campo) =>
        estudiante[campo]?.toLowerCase().includes(filtro.toLowerCase())
      )
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEstudiantes = estudiantesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h4>Gestión de Estudiantes</h4>

      <Form.Control
        type="text"
        placeholder="Buscar"
        value={filtro}
        onChange={handleFilterChange}
        className="mb-3"
      />

      <div className="botones-gestion mb-3">
        <Button
          className="btn-igual"
          onClick={() => setShowModal(true)}
          title="Agregar estudiante"
        >
          <FaUserPlus />
        </Button>
        <Button
          className="btn-igual"
          variant="secondary"
          onClick={() => navigate("/catalogocalificaciones")}
          title="Inscritos"
        >
          <FaClipboardList />
        </Button>
        <Button
          className="btn-igual"
          variant={verPapelera ? "primary" : "outline-secondary"}
          onClick={() => setVerPapelera(!verPapelera)}
          title={verPapelera ? "Ver activos" : "Ver papelera"}
        >
          <FaTrash />
        </Button>
      </div>

      <TablaEstudiantes
        estudiantes={currentEstudiantes}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        verPapelera={verPapelera}
        restaurarEstudiante={restaurarEstudiante}
        eliminarDefinitivamente={eliminarDefinitivamente}
      />

      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={estudiantesFiltrados.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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
