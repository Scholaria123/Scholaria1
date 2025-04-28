import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ModalEdicionCalificaciones from './ModalEdicionCalificaciones';
import ModalEliminarCalificaciones from './ModalEliminarCalificaciones';
import { useAuth } from '../../database/authcontext'; // <-- Agregado aquí
import './TablaCalificaciones.css';
import { Pencil, Trash2 } from 'lucide-react';

const TablaCalificaciones = ({ actualizar, onExportReady }) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [calificacionAEliminar, setCalificacionAEliminar] = useState(null);

  const { user } = useAuth();

  const esAdminODocente = user?.rol === 'admin' || user?.rol === 'docente';

  useEffect(() => {
    const cargarDatos = async () => {
      const calificacionesSnap = await getDocs(collection(db, 'calificaciones'));
      const asignaturasSnap = await getDocs(collection(db, 'asignaturas'));
      const estudiantesSnap = await getDocs(collection(db, 'estudiantes'));

      const calificacionesData = calificacionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const asignaturasData = asignaturasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const estudiantesData = estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCalificaciones(calificacionesData);
      setAsignaturas(asignaturasData);
      setEstudiantes(estudiantesData);

      if (onExportReady) {
        const exportData = calificacionesData.map(c => ({
          asignatura: asignaturasData.find(a => a.id === c.asignaturaId)?.nombre || 'Sin asignatura',
          estudiante: estudiantesData.find(e => e.id === c.estudianteId)?.nombre || 'Sin estudiante',
          parcial1: c.parcial1,
          parcial2: c.parcial2,
          parcial3: c.parcial3,
          final: c.final,
          observaciones: c.observaciones || '',
        }));
        onExportReady(exportData);
      }
    };

    cargarDatos();
  }, [actualizar]);

  const obtenerNombreAsignatura = id => asignaturas.find(a => a.id === id)?.nombre || 'Sin asignatura';
  const obtenerNombreEstudiante = id => estudiantes.find(e => e.id === id)?.nombre || 'Sin estudiante';

  const handleDeleteCalificacion = async () => {
    try {
      await deleteDoc(doc(db, 'calificaciones', calificacionAEliminar.id));
      setMostrarModalEliminar(false);
      setCalificacionAEliminar(null);

      const snap = await getDocs(collection(db, 'calificaciones'));
      setCalificaciones(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
            {/* Mostrar encabezado de acciones solo si es admin o docente */}
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
              {/* Mostrar botones SOLO si es admin o docente */}
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

      {mostrarModalEdicion && calificacionSeleccionada && (
        <ModalEdicionCalificaciones
          show={mostrarModalEdicion}
          setShow={setMostrarModalEdicion}
          calificacionEditada={calificacionSeleccionada}
          setCalificacionEditada={setCalificacionSeleccionada}
          onCalificacionActualizada={() => setMostrarModalEdicion(false)}
        />
      )}

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