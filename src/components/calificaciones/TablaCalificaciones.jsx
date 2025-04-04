import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const TablaCalificaciones = ({ actualizar }) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

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
  }, [actualizar]); // Se recarga al cambiar la prop

  const obtenerNombreAsignatura = id => asignaturas.find(a => a.id === id)?.nombre || 'Sin asignatura';
  const obtenerNombreEstudiante = id => estudiantes.find(e => e.id === id)?.nombre || 'Sin estudiante';

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCalificaciones;
