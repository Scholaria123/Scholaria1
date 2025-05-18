import React, { useState, useEffect } from 'react';
import ModalEdicionCalificaciones from './ModalEdicionCalificaciones';
import ModalEliminarCalificaciones from './ModalEliminarCalificaciones';
import { useAuth } from '../../database/authcontext';
import { db } from '../../database/firebaseconfig';
import { deleteDoc, doc } from 'firebase/firestore';
import './TablaCalificaciones.css';
import { Pencil, Trash2 } from 'lucide-react';

const TablaCalificaciones = ({ actualizar, calificaciones, onExportReady, asignaturas, estudiantes }) => {
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [calificacionAEliminar, setCalificacionAEliminar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { user } = useAuth();
  const esAdminODocente = user?.rol === 'admin' || user?.rol === 'docente';

  const obtenerNombreAsignatura = (id) => asignaturas.find(a => a.id === id)?.nombre || 'Sin asignatura';
  const obtenerNombreEstudiante = (id) => estudiantes.find(e => e.id === id)?.nombre || 'Sin estudiante';

  const totalPages = Math.ceil(calificaciones.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalificaciones = calificaciones.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteCalificacion = async () => {
    try {
      await deleteDoc(doc(db, 'calificaciones', calificacionAEliminar.id));
      alert('✅ Calificación eliminada con éxito.');
      setMostrarModalEliminar(false);
      setCalificacionAEliminar(null);
      actualizar();

      // Si la página actual queda vacía después de eliminar, retrocede una página
      if ((calificaciones.length - 1) % itemsPerPage === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error eliminando calificación:", error);
    }
  };

  return (
    <div className="tabla-container">
      <h3 className="tabla-title">Lista de Calificaciones</h3>
      <table className="tabla-estilizada">
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Estudiante</th>
            <th>Parcial 1</th>
            <th>Parcial 2</th>
            <th>Parcial 3</th>
            <th>Final</th>
            <th>Observaciones</th>
            {esAdminODocente && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {currentCalificaciones.map(c => (
            <tr key={c.id}>
              <td data-label="Asignatura">{obtenerNombreAsignatura(c.asignaturaId)}</td>
              <td data-label="Estudiante">{obtenerNombreEstudiante(c.estudianteId)}</td>
              <td data-label="Parcial 1">{c.parcial1}</td>
              <td data-label="Parcial 2">{c.parcial2}</td>
              <td data-label="Parcial 3">{c.parcial3}</td>
              <td data-label="Final">{c.final}</td>
              <td data-label="Observaciones">{c.observaciones}</td>
              {esAdminODocente && (
                <td className="acciones">
                  <button
                    className="editar"
                    onClick={() => {
                      setCalificacionSeleccionada(c);
                      setMostrarModalEdicion(true);
                    }}
                  >
                    <Pencil size={18} color="#fff" />
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => {
                      setCalificacionAEliminar(c);
                      setMostrarModalEliminar(true);
                    }}
                  >
                    <Trash2 size={18} color="#fff" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Página {currentPage} de {totalPages}</div>
        <div>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>{' '}
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal Edición */}
      {mostrarModalEdicion && calificacionSeleccionada && (
        <ModalEdicionCalificaciones
          show={mostrarModalEdicion}
          setShow={setMostrarModalEdicion}
          calificacionEditada={calificacionSeleccionada}
          setCalificacionEditada={setCalificacionSeleccionada}
        />
      )}

      {/* Modal Eliminar */}
      {mostrarModalEliminar && calificacionAEliminar && (
        <ModalEliminarCalificaciones
          showDeleteModal={mostrarModalEliminar}
          setShowDeleteModal={setMostrarModalEliminar}
          handleDeleteCalificacion={handleDeleteCalificacion}
          calificacionAEliminar={calificacionAEliminar}
          obtenerNombreAsignatura={obtenerNombreAsignatura}
          obtenerNombreEstudiante={obtenerNombreEstudiante}
        />
      )}
    </div>
  );
};

export default TablaCalificaciones;
