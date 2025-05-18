import React, { useState, useEffect } from 'react';
import TablaCalificaciones from '../calificaciones/TablaCalificaciones';
import ModalRegistroCalificaciones from '../calificaciones/ModalRegistroCalificaciones';
import ModalEdicionCalificaciones from '../calificaciones/ModalEdicionCalificaciones';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../database/authcontext';
import { db } from '../../database/firebaseconfig';
import { collection, onSnapshot } from 'firebase/firestore';
import Paginacion from '../ordenamiento/Paginacion';
import { Form, Button, Container } from 'react-bootstrap';

const Calificaciones = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionEditada, setCalificacionEditada] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [calificacionesExport, setCalificacionesExport] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { user } = useAuth();

  useEffect(() => {
    // Listener para asignaturas
    const unsubAsignaturas = onSnapshot(collection(db, 'asignaturas'), (snapshot) => {
      const asignaturasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAsignaturas(asignaturasData);
    });

    

    // Listener para estudiantes
    const unsubEstudiantes = onSnapshot(collection(db, 'estudiantes'), (snapshot) => {
      const estudiantesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEstudiantes(estudiantesData);
    });

    // Listener para calificaciones
    const unsubCalificaciones = onSnapshot(collection(db, 'calificaciones'), (snapshot) => {
      const calificacionesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCalificaciones(calificacionesData);

      // Actualizar exportación de PDF con datos actualizados
      const exportData = calificacionesData.map(c => ({
        asignatura: asignaturas.find(a => a.id === c.asignaturaId)?.nombre || 'Sin asignatura',
        estudiante: estudiantes.find(e => e.id === c.estudianteId)?.nombre || 'Sin estudiante',
        parcial1: c.parcial1,
        parcial2: c.parcial2,
        parcial3: c.parcial3,
        final: c.final,
        observaciones: c.observaciones || '',
      }));
      setCalificacionesExport(exportData);
    });

    // Cleanup
    return () => {
      unsubAsignaturas();
      unsubEstudiantes();
      unsubCalificaciones();
    };
  }, [asignaturas, estudiantes]);

  const handleRegistroExitoso = () => {
    setMostrarModal(false);
  };

  const handleEdicionCalificacion = (calificacion) => {
    setCalificacionEditada(calificacion);
    setMostrarModalEdicion(true);
  };

  const handleActualizacionExitosa = () => {
    setMostrarModalEdicion(false);
  };

  const exportarCalificacionesPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Calificaciones', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Asignatura', 'Estudiante', 'Parcial 1', 'Parcial 2', 'Parcial 3', 'Final', 'Observaciones']],
      body: calificacionesExport.map((c) => [
        c.asignatura,
        c.estudiante,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.observaciones,
      ]),
    });

    doc.save('calificaciones.pdf');
  };

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // resetear página al filtrar
  };

  // Función para refrescar lista (por ejemplo tras eliminar o editar)
  const refrescarCalificaciones = () => {
    // Como usas onSnapshot, la lista se actualiza automáticamente, pero podrías agregar aquí lógica si usas fetch.
    // También puedes usar esta función para resetear página si quieres.
    setCurrentPage(1);
  };

  const esAdminODocente = user?.rol === 'admin' || user?.rol === 'docente';

  const calificacionesFiltradas = calificaciones.filter((calificacion) =>
    ['asignaturaId', 'estudianteId', 'observaciones'].some((campo) =>
      (calificacion[campo] || '').toString().toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalificaciones = calificacionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="mt-5">
      <h2>Gestión de Calificaciones</h2>

      {esAdminODocente && (
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setMostrarModal(true)}>Registrar Calificación</Button>
          <Button onClick={exportarCalificacionesPDF} style={{ marginLeft: '10px' }}>
            Exportar PDF
          </Button>
        </div>
      )}

      <Form.Control
        type="text"
        placeholder="Buscar"
        value={filtro}
        onChange={handleFilterChange}
        className="mb-3"
      />

      {mostrarModal && (
        <ModalRegistroCalificaciones
          onClose={() => setMostrarModal(false)}
          onSuccess={handleRegistroExitoso}
        />
      )}

      <ModalEdicionCalificaciones
        show={mostrarModalEdicion}
        setShow={setMostrarModalEdicion}
        calificacionEditada={calificacionEditada}
        setCalificacionEditada={setCalificacionEditada}
        onCalificacionActualizada={handleActualizacionExitosa}
      />

      <TablaCalificaciones
        calificaciones={currentCalificaciones}
        onExportReady={setCalificacionesExport}
        asignaturas={asignaturas}
        estudiantes={estudiantes}
        onEditCalificacion={handleEdicionCalificacion}
         actualizar={refrescarCalificaciones}
      />

      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={calificacionesFiltradas.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Container>
  );
};

export default Calificaciones;
