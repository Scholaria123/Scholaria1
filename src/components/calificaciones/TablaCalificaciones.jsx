import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ModalEdicionCalificaciones from './ModalEdicionCalificaciones';
import ModalEliminarCalificaciones from './ModalEliminarCalificaciones';

const TablaCalificaciones = ({ actualizar }) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [calificacionAEliminar, setCalificacionAEliminar] = useState(null);

  const cargarDatos = async () => {
    const calificacionesSnap = await getDocs(collection(db, 'calificaciones'));
    const asignaturasSnap = await getDocs(collection(db, 'asignaturas'));
    const estudiantesSnap = await getDocs(collection(db, 'estudiantes'));

    setCalificaciones(calificacionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setAsignaturas(asignaturasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setEstudiantes(estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    cargarDatos();
  }, [actualizar]);

  const obtenerNombreAsignatura = id => asignaturas.find(a => a.id === id)?.nombre || 'Sin asignatura';
  const obtenerNombreEstudiante = id => estudiantes.find(e => e.id === id)?.nombre || 'Sin estudiante';

  const handleDeleteCalificacion = async () => {
    try {
      await deleteDoc(doc(db, 'calificaciones', calificacionAEliminar.id));
      setMostrarModalEliminar(false);
      setCalificacionAEliminar(null);
      cargarDatos(); // Recargar datos
    } catch (error) {
      console.error("Error eliminando calificación:", error);
    }
  };

  return (
    <div>
      <h3>Lista de Calificaciones</h3>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Estudiante</th>
            <th>Parcial 1</th>
            <th>Parcial 2</th>
            <th>Parcial 3</th>
            <th>Final</th>
            <th>Observaciones</th>
            <th>Acciones</th>
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
              <td>
                <button
                  onClick={() => {
                    setCalificacionSeleccionada(c);
                    setMostrarModalEdicion(true);
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setCalificacionAEliminar(c);
                    setMostrarModalEliminar(true);
                  }}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Eliminar
                </button>
              </td>
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
          onCalificacionActualizada={cargarDatos}
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
