import React, { useState } from 'react';
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

  const { user } = useAuth();
  const esAdminODocente = user?.rol === 'admin' || user?.rol === 'docente';

  const obtenerNombreAsignatura = (id) => asignaturas.find(a => a.id === id)?.nombre || 'Sin asignatura';
  const obtenerNombreEstudiante = (id) => estudiantes.find(e => e.id === id)?.nombre || 'Sin estudiante';

  const handleDeleteCalificacion = async () => {
    try {
      await deleteDoc(doc(db, 'calificaciones', calificacionAEliminar.id));
      setMostrarModalEliminar(false);
      setCalificacionAEliminar(null);
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
          {calificaciones.map(c => (
            <tr key={c.id}>
              <td>{obtenerNombreAsignatura(c.asignaturaId)}</td>
              <td>{obtenerNombreEstudiante(c.estudianteId)}</td>
              <td>{c.parcial1}</td>
              <td>{c.parcial2}</td>
              <td>{c.parcial3}</td>
              <td>{c.final}</td>
              <td>{c.observaciones}</td>
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
