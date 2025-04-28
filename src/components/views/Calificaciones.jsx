import React, { useState } from 'react';
import TablaCalificaciones from '../calificaciones/TablaCalificaciones';
import ModalRegistroCalificaciones from '../calificaciones/ModalRegistroCalificaciones';
import ModalEdicionCalificaciones from '../calificaciones/ModalEdicionCalificaciones';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../database/authcontext';


const Calificaciones = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionEditada, setCalificacionEditada] = useState(null);
  const [actualizarTabla, setActualizarTabla] = useState(false);
  const [calificacionesExport, setCalificacionesExport] = useState([]);

  const { user } = useAuth(); // <-- OBTENEMOS el usuario de contexto

  const handleRegistroExitoso = () => {
    setActualizarTabla(prev => !prev);
    setMostrarModal(false);
  };

  const handleEdicionCalificacion = (calificacion) => {
    setCalificacionEditada(calificacion);
    setMostrarModalEdicion(true);
  };

  const handleActualizacionExitosa = () => {
    setActualizarTabla(prev => !prev);
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
        c.observaciones || '',
      ]),
    });

    doc.save('calificaciones.pdf');
  };

  return (
    <div>
      <h2>Gestión de Calificaciones</h2>

      {/* Mostrar botones SOLO si no es estudiante */}
      {user?.rol !== 'estudiante' && (
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setMostrarModal(true)}>Registrar Calificación</button>
          <button onClick={exportarCalificacionesPDF} style={{ marginLeft: '10px' }}>
            Exportar PDF
          </button>
        </div>
      )}

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
        actualizar={actualizarTabla}
        onEditar={user?.rol !== 'estudiante' ? handleEdicionCalificacion : null} // <-- SOLO permitir editar si no es estudiante
        onExportReady={setCalificacionesExport}
      />
    </div>
  );
};

export default Calificaciones;
